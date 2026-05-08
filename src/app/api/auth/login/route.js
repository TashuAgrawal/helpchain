import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/lib/models/User"; 
import OtpVerification from "@/app/lib/models/OtpVerification";
import sendOtpEmail from "@/app/lib/sendEmail";
import { generateOtp, hashOtp } from "@/app/lib/otp";

/**
 * Handles POST requests for user login (Sign In).
 * Checks MongoDB credentials.
 * - If isVerified is false: sends a fresh OTP and asks frontend to verify.
 * - If isVerified is true: issues a Firebase Custom Token.
 */
export async function POST(request) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    // Find the user by email in MongoDB, explicitly select password field
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Always send OTP on every login attempt
    const otp = generateOtp();
    const otpHash = hashOtp(normalizedEmail, otp);

    await OtpVerification.deleteMany({ email: normalizedEmail, isUsed: false });
    await OtpVerification.create({
      email: normalizedEmail,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const result = await sendOtpEmail(normalizedEmail, otp);
    if (!result.success) {
      return NextResponse.json({ message: "Failed to send OTP email." }, { status: 500 });
    }

    return NextResponse.json({
      message: "OTP sent to your email. Please verify to complete login.",
      requiresOtp: true,
      email: normalizedEmail,
    }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "An unexpected error occurred during login." }, { status: 500 });
  }
}
