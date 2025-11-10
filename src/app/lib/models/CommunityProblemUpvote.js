import mongoose, { Schema } from "mongoose";

const CommunityProblemUpvoteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "CommunityProblem",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// To ensure a user can only upvote a problem once
CommunityProblemUpvoteSchema.index({ userId: 1, problemId: 1 }, { unique: true });

const CommunityProblemUpvote =
  mongoose.models.CommunityProblemUpvote ||
  mongoose.model("CommunityProblemUpvote", CommunityProblemUpvoteSchema);

export default CommunityProblemUpvote;
