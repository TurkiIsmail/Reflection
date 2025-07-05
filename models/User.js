import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  favoriteColor: { type: String },
  streak: { type: Number, default: 0 },
  lastJournalDate: { type: Date },
  recordStreak: { type: Number, default: 0 },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
