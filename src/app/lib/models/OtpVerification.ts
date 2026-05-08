import mongoose, { Schema, models } from "mongoose";

const otpVerificationSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const OtpVerification =
  models.OtpVerification ||
  mongoose.model("OtpVerification", otpVerificationSchema);

export default OtpVerification;