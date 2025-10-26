// src/app/api/auth/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/lib/models/User";
import { adminAuth } from "@/app/lib/firebaseAdmin"; // <-- Import the Admin SDK

/**
 * Handles POST requests for user registration (Sign Up).
 */
export async function POST(request) {
  try {
    await connectDB();
    
    const { email, username, password } = await request.json();
    console.log(email , username , password);
    
    if (!email || !username || !password) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });

    console.log(existingUser);
    
    if (existingUser) {
      return NextResponse.json({ message: "User with this email or username already exists." }, { status: 409 });
    }
    console.log("Heyy");
    // 2. Create the new user in MongoDB
    const newUser = await User.create({ email, username, password });
    
    // 3. Generate a Custom Token using the Firebase Admin SDK
    //    We use the MongoDB _id as the unique identifier (uid) for Firebase.
    const firebaseUid = newUser._id.toString();
    const customToken = await adminAuth.createCustomToken(firebaseUid, {
        // Optional: Add custom claims for roles/permissions
        role: newUser.role,
        mongoId: firebaseUid
    });

    // 4. Return the custom token to the client
    return NextResponse.json({ 
      message: "User registered successfully", 
      userId: firebaseUid, // Using the MongoDB ID as the common identifier
      customToken: customToken // <-- CRITICAL: The token for the client to sign in
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