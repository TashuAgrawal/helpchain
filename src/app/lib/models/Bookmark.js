import mongoose, { Schema } from "mongoose";

const BookmarkSchema = new Schema({
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
});

// To ensure a user cannot bookmark the same NGO multiple times
BookmarkSchema.index({ userId: 1, ngoId: 1 }, { unique: true });

const Bookmark =
  mongoose.models.Bookmark || mongoose.model("Bookmark", BookmarkSchema);

export default Bookmark;
