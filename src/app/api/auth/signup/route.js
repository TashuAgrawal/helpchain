import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/lib/models/User";
import OtpVerification from "@/app/lib/models/OtpVerification";
import sendOtpEmail from "@/app/lib/sendEmail";
import { generateOtp, hashOtp } from "@/app/lib/otp";

/**
 * Handles POST requests for user registration (Sign Up).
 * Creates the user, sends OTP, and returns requiresOtp: true.
 * Firebase sign-in is completed only after OTP is verified.
 */
export async function POST(request) {
  try {
    await connectDB();
    
    const { email, username, password, role } = await request.json();

    if (!email || !username || !password || !role) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    // Validate role for only user and admin
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: "Invalid role specified." }, { status: 400 });
    }

    // Check if user exists by email or username
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return NextResponse.json({ message: "User with this email or username already exists." }, { status: 409 });
    }

    // Create the new user (isVerified defaults to false)
    await User.create({ email, username, password, role });

    // Generate and send OTP
    const normalizedEmail = email.toLowerCase().trim();
    const otp = generateOtp();
    const otpHash = hashOtp(normalizedEmail, otp);

    // Remove any existing unused OTPs for this email
    await OtpVerification.deleteMany({ email: normalizedEmail, isUsed: false });

    // Save new OTP record (expires in 5 minutes)
    await OtpVerification.create({
      email: normalizedEmail,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const result = await sendOtpEmail(normalizedEmail, otp);
    if (!result.success) {
      return NextResponse.json({ message: "User created but failed to send OTP email." }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "User registered successfully. Please verify your email.",
      requiresOtp: true,
      email: normalizedEmail,
    }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ message: "Validation failed.", errors: messages }, { status: 400 });
    }

    return NextResponse.json({ message: "An unexpected error occurred during registration." }, { status: 500 });
  }
}
