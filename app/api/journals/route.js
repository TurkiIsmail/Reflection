import dbConnect from "@/lib/mongodb";
import Journal from "@/models/Journal";
import { verifyToken } from "@/lib/auth";

// GET: Get all journals for a user (user id from JWT)
import User from "@/models/User";

export async function GET(req) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Missing or invalid token" }), { status: 401 });
  }
  const token = auth.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }
  await dbConnect();
  const journals = await Journal.find({ user: payload.id }).sort({ createdAt: -1 });
  // Also return streak info
  const user = await User.findById(payload.id);
  const streak = user?.streak || 0;
  const recordStreak = user?.recordStreak || 0;
  return new Response(JSON.stringify({ journals, streak, recordStreak }), { status: 200 });
}

// POST: Add a new journal for a user (user id from JWT)

export async function POST(req) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Missing or invalid token" }), { status: 401 });
  }
  const token = auth.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }
  const { content } = await req.json();
  if (!content) return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  await dbConnect();

  // Only allow one journal per user per day
  const today = new Date();
  today.setHours(0,0,0,0);
  const existing = await Journal.findOne({ user: payload.id, createdAt: { $gte: today } });
  if (existing) {
    return new Response(JSON.stringify({ error: "You can only fill the journal once per day." }), { status: 400 });
  }

  // Create journal
  const journal = await Journal.create({ user: payload.id, content });

  // Update streak logic only if not in development/test (skip if running in test or if user is not found)
  if (process.env.NODE_ENV !== 'test') {
    const user = await User.findById(payload.id);
    if (user) {
      const lastDate = user.lastJournalDate ? new Date(user.lastJournalDate) : null;
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      let newStreak = 1;
      if (lastDate && lastDate.toDateString() === yesterday.toDateString()) {
        newStreak = (user.streak || 0) + 1;
      }
      const newRecord = Math.max(user.recordStreak || 0, newStreak);
      user.streak = newStreak;
      user.lastJournalDate = today;
      user.recordStreak = newRecord;
      await user.save();
    }
  }

  return new Response(JSON.stringify(journal), { status: 201 });
}
