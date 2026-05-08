import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import OtpVerification from "@/app/lib/models/OtpVerification";
import User from "@/app/lib/models/User";
import NGO from "@/app/lib/models/NGO";
import { hashOtp } from "@/app/lib/otp";
import { adminAuth } from "@/app/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, otp, userType } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpHash = hashOtp(normalizedEmail, otp);

    // Find a valid, unused OTP record
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

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Determine which model to update based on userType
    let entity: any = null;

    if (userType === "ngo") {
      entity = await NGO.findOneAndUpdate(
        { email: normalizedEmail },
        { isVerified: true },
        { new: true }
      );
    } else {
      // Covers "user" and "admin"
      entity = await User.findOneAndUpdate(
        { email: normalizedEmail },
        { isVerified: true },
        { new: true }
      );
    }

    if (!entity) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 }
      );
    }

    // Issue Firebase Custom Token so frontend can complete sign-in
    const firebaseUid = entity._id.toString();
    const role = userType === "ngo" ? "ngo" : entity.role;
    const customToken = await adminAuth.createCustomToken(firebaseUid, {
      role,
      mongoId: firebaseUid,
    });

    return NextResponse.json(
      { message: "Email verified successfully", customToken },
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