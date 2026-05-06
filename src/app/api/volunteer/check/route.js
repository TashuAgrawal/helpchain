import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Volunteer from "@/app/lib/models/Volunteer";

/**
 * POST /api/volunteer/check
 * Checks if user already exists in volunteers collection
 */
export async function POST(request) {
  try {
    await connectDB();

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    const existingVolunteer = await Volunteer.findOne({ userId });

    if (existingVolunteer) {
      return NextResponse.json({
        success: true,
        exists: true,
        volunteer: existingVolunteer,
      });
    }

    return NextResponse.json({
      success: true,
      exists: false,
    });

  } catch (error) {
    console.error("Check Volunteer Error:", error);

    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}