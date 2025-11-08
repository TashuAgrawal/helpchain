import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import NGO from "@/app/lib/models/NGO";
import { adminAuth } from "@/app/lib/firebaseAdmin"; // Import Firebase Admin SDK

/**
 * Handles POST requests for NGO registration (Sign Up).
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

    // Create a new NGO (status defaults to 'pending')
    const newNGO = await NGO.create({
      name,
      email,
      password,
      cause: "General Cause",
      description: "Default description",
      registrationNumber: "REG12345",
      address: "Default Address",
      totalDonations: 0,
      status: "pending",
      submittedDate: new Date(),
    });

    // Generate a Firebase Custom Token using MongoDB _id as UID
    const firebaseUid = newNGO._id.toString();
    const customToken = await adminAuth.createCustomToken(firebaseUid, {
      role: "ngo",
      mongoId: firebaseUid,
    });

    return NextResponse.json({
      message: "NGO registered successfully",
      ngoId: firebaseUid,
      customToken,
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
