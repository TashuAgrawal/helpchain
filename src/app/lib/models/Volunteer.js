import mongoose, { Schema } from "mongoose";

const VolunteerSchema = new Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  pincode: {
    type: String,
    required: true,
    trim: true,
  },
  isCurrently: {
    type: Boolean,
    default: true,
  },
  requestsReceived: {
    type: Number,
    default: 0,
  },
  requestsAccepted: {
    type: Number,
    default: 0,
  },
  actuallyVolunteered: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Volunteer =
  mongoose.models.Volunteer ||
  mongoose.model("Volunteer", VolunteerSchema);

export default Volunteer;