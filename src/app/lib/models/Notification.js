import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  message: {
    type: String,
    required: true,
    trim: true,
  },

  type: {
    type: String,
    enum: [
      "follow",
      "campaign_update",
      "campaign_post",
      "volunteer_message",
      "general",
      "new_campaign",
    ],
    required: true,
  },

  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    default: null,
  },

  fromUserId: {
    type: String, // optional sender (for follow/message)
    default: null,
  },

  isRead: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);

export default Notification;