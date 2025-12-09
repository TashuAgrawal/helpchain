// src/app/api/user/[userId]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/lib/models/User";

/**
 * GET /api/user/[userId]
 * Returns user details by ID
 */
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { message: "Missing userId parameter." },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    console.log(user);
    
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User fetched successfully.",
        user: {
          id: user._id,
          name: user.username,
          email: user.email,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get User Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch user." },
      { status: 500 }
    );
  }
}
