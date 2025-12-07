import mongoose, { Schema } from "mongoose";

const FeedbackSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Feedback text is required"],
      trim: true,
      maxlength: [1000, "Feedback cannot exceed 1000 characters"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ngoId: {
      type: Schema.Types.ObjectId,
      ref: "NGO",
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

// Indexes for fast queries (NOT unique - multiple feedbacks allowed)
FeedbackSchema.index({ userId: 1, ngoId: 1 });           // Fast user-NGO queries
FeedbackSchema.index({ ngoId: 1, createdAt: -1 });       // Recent NGO feedback
FeedbackSchema.index({ createdAt: -1 });                 // Recent feedback overall

const Feedback =
  mongoose.models.Feedback ||
  mongoose.model("Feedback", FeedbackSchema);

export default Feedback;
