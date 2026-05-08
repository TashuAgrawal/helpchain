import mongoose, { Schema } from "mongoose";

/**
 * Strike Model
 *
 * Lifecycle:
 *  1. User files a strike against a campaign → status: 'pending'
 *  2. Admin reviews and accepts → status: 'accepted'  (campaign becomes isStruck: true)
 *     Admin rejects the strike  → status: 'rejected'
 *  3. NGO replies to an accepted strike → ngoReply + repliedAt are populated
 *  4. Admin can delete the strike entirely → campaign's isStruck resets to false
 */
const StrikeSchema = new Schema(
  {
    // The campaign being struck
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campain",   // matches the existing model name in Campaign.js
      required: [true, "Campaign ID is required"],
      index: true,
    },

    // The user who filed the strike
    filedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    // Reason the user is raising a strike
    reason: {
      type: String,
      required: [true, "Reason is required"],
      trim: true,
      minlength: [10, "Reason must be at least 10 characters"],
    },

    // Optional evidence / supporting details from user
    details: {
      type: String,
      trim: true,
      default: "",
    },

    /**
     * Admin review
     * pending  → not yet reviewed
     * accepted → admin agreed; campaign is locked
     * rejected → admin dismissed the strike
     */
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      index: true,
    },

    // Admin who reviewed this strike
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Admin notes / reason for accept or reject
    adminNote: {
      type: String,
      trim: true,
      default: "",
    },

    // When admin reviewed
    reviewedAt: {
      type: Date,
      default: null,
    },

    // NGO's reply / defence after seeing the accepted strike
    ngoReply: {
      type: String,
      trim: true,
      default: "",
    },

    // When NGO replied
    repliedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Strike = mongoose.models.Strike || mongoose.model("Strike", StrikeSchema);

export default Strike;
