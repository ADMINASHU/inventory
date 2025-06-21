import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "Branch" },
  email: {
    type: String,
    required: true,
  },
  address: { type: String, required: true },
  gst: { type: String },
  mobileNo: { type: String, required: true },
  region: { type: String, required: true },
});

// Prevents redefining the model during hot reloading
export default mongoose.models?.Branch || mongoose.model("Branch", BranchSchema);
