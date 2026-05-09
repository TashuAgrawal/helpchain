import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import OtpVerification from "@/app/lib/models/OtpVerification";
import User from "@/app/lib/models/User";
import NGO from "@/app/lib/models/NGO";
import { hashOtp } from "@/app/lib/otp";
import { adminAuth } from "@/app/lib/firebaseAdmin";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, otp, action, newPassword, userType } = await request.json();

    if (!email || !otp || !action || !userType) {
      return NextResponse.json(
        { message: "Email, OTP, action, and role are required." },
        { status: 400 }
      );
    }

    if (action === "reset" && !newPassword) {
      return NextResponse.json(
        { message: "New password is required for reset action." },
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
        { message: "Invalid or expired OTP." },
        { status: 400 }
      );
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    let entity: any = null;
    let collection = userType === "ngo" ? NGO : User;

    entity = await collection.findOne({ email: normalizedEmail });

    if (!entity) {
      return NextResponse.json(
        { message: "Account not found." },
        { status: 404 }
      );
    }

    // Always verify email if they got this far with a valid OTP
    if (!entity.isVerified) {
      entity.isVerified = true;
      await entity.save();
    }

    if (action === "login") {
      // Issue custom token to bypass password
      const firebaseUid = entity._id.toString();
      const role = userType === "ngo" ? "ngo" : entity.role;
      const customToken = await adminAuth.createCustomToken(firebaseUid, {
        role,
        mongoId: firebaseUid,
      });

      return NextResponse.json(
        { message: "Logged in successfully.", customToken, user: { role, email: entity.email } },
        { status: 200 }
      );
    } else if (action === "reset") {
      // Reset password
      entity.password = newPassword; // Mongoose pre-save hook will hash it
      await entity.save();

      return NextResponse.json(
        { message: "Password updated successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid action." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Forgot Password Verify Error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
