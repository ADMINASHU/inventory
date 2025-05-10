import mongoose from "mongoose";

const ListSchema = new mongoose.Schema(
  {
    partName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    inventory: [
      {
        account: [{ type: String, required: true }],
        count: [{ type: Number, required: true }],
      },
    ],
  },
  { timestamps: true }
);

export const List = mongoose.models.List || mongoose.model("List", ListSchema);
