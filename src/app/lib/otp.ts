import crypto from "crypto";

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashOtp(email: string, otp: string) {
  return crypto
    .createHash("sha256")
    .update(`${email}:${otp}:${process.env.OTP_SECRET}`)
    .digest("hex");
}