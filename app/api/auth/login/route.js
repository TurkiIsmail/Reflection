import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  const { email, password } = await req.json();
  await dbConnect();
  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }
  const token = signToken({ id: user._id, email: user.email, name: user.name });
  return new Response(JSON.stringify({ token, user: { email: user.email, name: user.name, id: user._id, favoriteColor: user.favoriteColor } }), { status: 200 });
}
