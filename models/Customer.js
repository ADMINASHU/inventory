import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "Customer" },
  email: {
    type: String,
    required: true,
  },
  address: { type: String, required: true },
  gst: { type: String },
  mobileNo: { type: String, required: true },
  region: { type: String, required: true },
  branch: { type: String, required: true },
  type: { type: String, required: true, default: "CUSTOMER" },
});

// Prevents redefining the model during hot reloading
export default mongoose.models?.Customer || mongoose.model("Customer", UserSchema);
