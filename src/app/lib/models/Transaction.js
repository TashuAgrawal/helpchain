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
    default: Date.now
  },
  status: {
    type: String,
    trim: true,
  },
  campaignid: {
    type: String,
    trim: true,
  },
  utilization: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

export default Transaction;
