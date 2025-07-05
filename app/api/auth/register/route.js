import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password, name, favoriteColor } = await req.json();
  await dbConnect();
  const existing = await User.findOne({ email });
  if (existing) {
    return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, name, favoriteColor });
  return new Response(JSON.stringify({ email: user.email, name: user.name, favoriteColor: user.favoriteColor }), { status: 201 });
}
