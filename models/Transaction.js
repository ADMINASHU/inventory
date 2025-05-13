import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    items: [
      {
        partId: { type: String, required: true },
        count: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    transactionMethod: { type: String, required: true },
    transactionType: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updateHistory: [
      { 
        updateType: { type: String, required: true },
        updatedBy: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    isDeleted: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    approvedBy: { type: String, default: null },  
    approvedAt: { type: Date, default: null },
  
    note: { type: String, default: null },
    attachment: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        id: { type: Number, required: true },
      },
    ],
    transactionStatus: { type: String, required: true },
  },
  { timestamps: true }
);

export const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
