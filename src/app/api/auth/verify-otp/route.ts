import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import OtpVerification from "@/app/lib/models/OtpVerification";
import User from "@/app/lib/models/User";
import { hashOtp } from "@/app/lib/otp";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpHash = hashOtp(normalizedEmail, otp);

    const otpRecord = await OtpVerification.findOne({
      email: normalizedEmail,
      otpHash,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    await User.findOneAndUpdate(
      { email: normalizedEmail },
      { isVerified: true }
    );

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}