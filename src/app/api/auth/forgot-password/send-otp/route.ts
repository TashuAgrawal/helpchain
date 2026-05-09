import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/lib/models/User";
import NGO from "@/app/lib/models/NGO";
import OtpVerification from "@/app/lib/models/OtpVerification";
import sendOtpEmail from "@/app/lib/sendEmail";
import { generateOtp, hashOtp } from "@/app/lib/otp";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user or NGO exists
    const user = await User.findOne({ email: normalizedEmail });
    const ngo = await NGO.findOne({ email: normalizedEmail });

    if (!user && !ngo) {
      return NextResponse.json({ message: "No account found with this email." }, { status: 404 });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(normalizedEmail, otp);

    await OtpVerification.deleteMany({ email: normalizedEmail, isUsed: false });
    await OtpVerification.create({
      email: normalizedEmail,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    const result = await sendOtpEmail(normalizedEmail, otp);
    if (!result.success) {
      return NextResponse.json({ message: "Failed to send OTP email." }, { status: 500 });
    }

    // Determine role for client convenience
    let role = "user";
    if (ngo) {
      role = "ngo";
    } else if (user && user.role === "admin") {
      role = "admin";
    }

    return NextResponse.json({
      message: "OTP sent to your email.",
      role,
    }, { status: 200 });

  } catch (error) {
    console.error("Send Forgot Password OTP Error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
