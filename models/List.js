import mongoose from "mongoose";

const ListSchema = new mongoose.Schema(
  {
    partName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    rate: { type: Number},
  },
  { timestamps: true }
);

export const List = mongoose.models.List || mongoose.model("List", ListSchema);
