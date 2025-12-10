// src/app/lib/models/Solution.js

import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema({
  problemId: {
    type: String,
    required: true,
    index: true
  },
  ngoId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  solutionDescription: {
    type: String,
    required: true,
    trim: true
  },
  estimatedCost: {
    type: Number,
    required: true,
    min: 0
  },
  timeline: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'in-progress', 'completed'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
}, {
  timestamps: true
});

const Solution = mongoose.models.Solution || mongoose.model('Solution', solutionSchema);

export default Solution;
