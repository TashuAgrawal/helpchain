import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import NGO from "@/app/lib/models/NGO"; 
import OtpVerification from "@/app/lib/models/OtpVerification";
import sendOtpEmail from "@/app/lib/sendEmail";
import { generateOtp, hashOtp } from "@/app/lib/otp";

/**
 * Handles POST requests for NGO login (Sign In).
 * Checks MongoDB credentials and NGO approval status.
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

    // Find the NGO by email in MongoDB, explicitly select password field
    const ngo = await NGO.findOne({ email }).select('+password');

    // Check if NGO exists and password is correct
    if (!ngo || !(await ngo.comparePassword(password))) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
    }

    // Check if NGO is approved before allowing login
    if (ngo.status !== 'approved') {
      return NextResponse.json({ message: `NGO registration is ${ngo.status}. Access denied.` }, { status: 403 });
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
    console.error("NGO Login Error:", error);
    return NextResponse.json({ message: "An unexpected error occurred during login." }, { status: 500 });
  }
}
