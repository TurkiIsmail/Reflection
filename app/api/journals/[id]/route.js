import dbConnect from "@/lib/mongodb";
import Journal from "@/models/Journal";
import { verifyToken } from "@/lib/auth";

// PUT: Update a journal by ID
export async function PUT(req, { params }) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Missing or invalid token" }), { status: 401 });
  }
  const token = auth.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }
  const { id } = params;
  const { content } = await req.json();
  if (!content) return new Response(JSON.stringify({ error: "Missing content" }), { status: 400 });
  await dbConnect();
  const journal = await Journal.findOneAndUpdate(
    { _id: id, user: payload.id },
    { content: typeof content === 'string' ? content : JSON.stringify(content) },
    { new: true }
  );
  if (!journal) return new Response(JSON.stringify({ error: "Journal not found" }), { status: 404 });
  // Parse content before returning
  const result = journal.toObject();
  try {
    result.content = JSON.parse(result.content);
  } catch {
    // fallback: leave as string
  }
  return new Response(JSON.stringify(result), { status: 200 });
}

// DELETE: Delete a journal by ID
export async function DELETE(req, { params }) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Missing or invalid token" }), { status: 401 });
  }
  const token = auth.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }
  const { id } = params;
  await dbConnect();
  const result = await Journal.deleteOne({ _id: id, user: payload.id });
  if (result.deletedCount === 0) {
    return new Response(JSON.stringify({ error: "Journal not found" }), { status: 404 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
