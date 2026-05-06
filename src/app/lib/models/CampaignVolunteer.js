import mongoose, { Schema } from "mongoose";

const CampaignVolunteerSchema = new Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Campaign", // change if your collection name differs
  },
  volunteerId: {
    type: String, // or ObjectId if you have a User model
    required: true,
    trim: true,
  },
  requestStatus: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  attended: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Prevent duplicate entries for same volunteer in same campaign
CampaignVolunteerSchema.index(
  { campaignId: 1, volunteerId: 1 },
  { unique: true }
);

const CampaignVolunteer =
  mongoose.models.CampaignVolunteer ||
  mongoose.model("CampaignVolunteer", CampaignVolunteerSchema);

export default CampaignVolunteer;