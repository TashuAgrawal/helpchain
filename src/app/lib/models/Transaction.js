import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema({
  donor: {
    type: String,
    required: true,
    trim: true,
  },
  ngo: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    trim: true,
  },
  utilization: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt fields
});

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

export default Transaction;
