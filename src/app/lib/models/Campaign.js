import mongoose, { Schema } from "mongoose";

const CampaignSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  goal: {
    type: Number,
    required: true,
  },
  raised: {
    type: Number,
    required: true,
    default: 0,
  },
  donors: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    required: true,
    trim: true,
  },
  lastUpdate: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  ngoId: {
    type: Schema.Types.ObjectId,
    ref: "NGO", 
    required: true,
  },
}, {
  timestamps: true,
});

const Campaign = mongoose.models.Campain || mongoose.model("Campain", CampaignSchema);

export default Campaign;
