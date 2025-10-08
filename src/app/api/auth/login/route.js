// src/app/api/auth/login/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User"; 
import { adminAuth } from "@/lib/firebaseAdmin";

/**
 * Handles POST requests for user login (Sign In).
 * This checks MongoDB credentials and issues a Firebase Custom Token.
 */
export async function POST(request) {
    try {
        await connectDB();
        
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
        }

        // 1. Find the user by email in MongoDB
       // NEW CODE (Explicitly selects the password hash for comparison)
         const user = await User.findOne({ email }).select('+password');
        
        // 2. Check if the user exists and if the password is correct
        // NOTE: You must implement a method in your User model to compare the hashed password.
        // Assuming your Mongoose User model has a method called 'comparePassword'.
        if (!user || !(await user.comparePassword(password))) {
            return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
        }

        // 3. Generate a Custom Token for Firebase
        const firebaseUid = user._id.toString();
        const customToken = await adminAuth.createCustomToken(firebaseUid, {
            // Optional: Add custom claims for roles/permissions
            role: user.role,
            mongoId: firebaseUid
        });

        // 4. Return the custom token to the client
        return NextResponse.json({ 
            message: "Login successful", 
            customToken: customToken
        }, { status: 200 });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ message: "An unexpected error occurred during login." }, { status: 500 });
    }
}