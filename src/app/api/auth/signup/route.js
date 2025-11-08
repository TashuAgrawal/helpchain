import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/lib/models/User";
import { adminAuth } from "@/app/lib/firebaseAdmin"; // Import Firebase Admin SDK

/**
 * Handles POST requests for user registration (Sign Up).
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

    // Create the new user
    const newUser = await User.create({ email, username, password, role });
    
    // Generate a Firebase Custom Token using the MongoDB _id as uid
    const firebaseUid = newUser._id.toString();
    const customToken = await adminAuth.createCustomToken(firebaseUid, {
      role: newUser.role,
      mongoId: firebaseUid
    });

    return NextResponse.json({ 
      message: "User registered successfully", 
      userId: firebaseUid,
      customToken: customToken
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
