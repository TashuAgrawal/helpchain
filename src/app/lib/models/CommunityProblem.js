import mongoose, { Schema } from "mongoose";

const CommunityProblemSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  postedBy: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  responses: {
    type: Number,
    default: 0,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  userVoted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, 
});

const CommunityProblem = mongoose.models.CommunityProblem || mongoose.model("CommunityProblem", CommunityProblemSchema);

export default CommunityProblem;
