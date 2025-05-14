import mongoose from "mongoose";

const ListSchema = new mongoose.Schema(
  {
    partName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    counts: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: false },
        count: { type: Number, required: false },
      },
    ],
  },
  { timestamps: true }
);

export const List = mongoose.models.List || mongoose.model("List", ListSchema);
