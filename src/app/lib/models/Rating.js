import mongoose, { Schema } from "mongoose";

const RatingSchema = new Schema(
  {
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
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

// **UNIQUE CONSTRAINT** - One rating per user per NGO
RatingSchema.index({ userId: 1, ngoId: 1 }, { unique: true });

const Rating =
  mongoose.models.Rating ||
  mongoose.model("Rating", RatingSchema);

export default Rating;
