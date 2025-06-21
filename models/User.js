import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // allow OAuth users without password
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isSecure: {
    type: Boolean,
    required: true,
    default: true,
  },
  verified: { type: Boolean, required: true, default: false },
  fName: { type: String, required: true, default: "User" },
  eName: { type: String },
  image: { type: String, required: true, default: "user.png" },
  address: { type: String },
  region: { type: String },
  branch: { type: String },
  type: { type: String , required: true, default: "USER", enum: ["USER", "STORE"] },
  mobileNo: { type: String },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  provider: { type: String },
  providerAccountId: { type: String },
});

// Prevents redefining the model during hot reloading
export default mongoose.models?.User || mongoose.model("User", UserSchema);
