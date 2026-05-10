import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import OtpVerification from "@/app/lib/models/OtpVerification";
import sendOtpEmail from "@/app/lib/sendEmail";
import { generateOtp, hashOtp } from "@/app/lib/otp";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const otp = generateOtp();
    console.log("otp : ", otp);
    const otpHash = hashOtp(normalizedEmail, otp);

    await OtpVerification.deleteMany({
      email: normalizedEmail,
      isUsed: false,
    });

    await OtpVerification.create({
      email: normalizedEmail,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const result = await sendOtpEmail(normalizedEmail, otp);

    if (!result.success) {
      return NextResponse.json(
        { message: "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP Error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}