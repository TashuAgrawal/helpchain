import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import NGO from "@/app/lib/models/NGO";
import OtpVerification from "@/app/lib/models/OtpVerification";
import sendOtpEmail from "@/app/lib/sendEmail";
import { generateOtp, hashOtp } from "@/app/lib/otp";

/**
 * Handles POST requests for NGO registration (Sign Up).
 * Creates the NGO, sends OTP, and returns requiresOtp: true.
 * Firebase sign-in is completed only after OTP is verified.
 */
export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    // Check if NGO exists by email or name
    const existingNGO = await NGO.findOne({
      $or: [{ email }, { name }]
    });

    if (existingNGO) {
      return NextResponse.json({ message: "NGO with this name or email already exists." }, { status: 409 });
    }

    // Generate a unique registration number
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const registrationNumber = `REG${randomSuffix}`;

    // Create a new NGO (status defaults to 'pending', isVerified defaults to false)
    await NGO.create({
      name,
      email,
      password,
      cause: "General Cause",
      description: "Default description",
      registrationNumber,
      address: "Default Address",
      totalDonations: 0,
      status: "pending",
      submittedDate: new Date(),
    });

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
      return NextResponse.json({ message: "NGO registered but failed to send OTP email." }, { status: 500 });
    }

    return NextResponse.json({
      message: "NGO registered successfully. Please verify your email.",
      requiresOtp: true,
      email: normalizedEmail,
    }, { status: 201 });

  } catch (error) {
    console.error("NGO Registration Error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ message: "Validation failed.", errors: messages }, { status: 400 });
    }

    return NextResponse.json({ message: "An unexpected error occurred during NGO registration." }, { status: 500 });
  }
}
