import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Volunteer from "@/app/lib/models/Volunteer";

/**
 * POST /api/volunteer/toggle
 * Toggles isCurrently OR creates a new volunteer if not exists
 * Expects JSON body with userId, pincode (required if creating)
 */
export async function POST(request) {
  try {
    await connectDB();

    const { userId, pincode } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "Missing required field (userId)." },
        { status: 400 }
      );
    }

    let volunteer = await Volunteer.findOne({ userId });

    // 🧠 If not found → create new
    if (!volunteer) {
      if (!pincode) {
        return NextResponse.json(
          { message: "pincode is required for new volunteer." },
          { status: 400 }
        );
      }

      volunteer = await Volunteer.create({
        userId,
        pincode,
        isCurrently: true, // new volunteer starts as active
      });

      return NextResponse.json(
        {
          message: "Volunteer created and set to ACTIVE.",
          isCurrently: volunteer.isCurrently,
        },
        { status: 201 }
      );
    }

    // 🔁 Toggle existing
    volunteer.isCurrently = !volunteer.isCurrently;
    await volunteer.save();

    return NextResponse.json(
      {
        message: `Volunteer is now ${
          volunteer.isCurrently ? "ACTIVE" : "INACTIVE"
        }.`,
        isCurrently: volunteer.isCurrently,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Toggle Volunteer Error:", error);
    return NextResponse.json(
      { message: "Failed to toggle volunteer status." },
      { status: 500 }
    );
  }
}