import mongoose, { model } from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  email_verified: { type: Boolean, required: true, default: false },
  verification_token: { type: String, required: true },
  verification_token_time: { type: Date, required: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  reset_password_token: { type: String, required: false },
  reset_password_token_time: { type: Date, required: false },
  created_at: { type: Date, required: true, default: new Date() },
  updated_at: { type: Date, required: true, default: new Date() },
});

export default model("users", userSchema);
