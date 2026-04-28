import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Feedback from "@/app/lib/models/Feedback";

/**
 * POST /api/feedback/reply
 * Finds an existing feedback by ID and updates the reply field.
 */
export async function POST(request) {
  try {
    await connectDB();

    const { feedbackId, reply } = await request.json();

    // 1. Validation
    if (!feedbackId || !reply) {
      return NextResponse.json(
        { message: "Missing feedbackId or reply text." },
        { status: 400 }
      );
    }

    // 2. Find and Update
    // { new: true } returns the document AFTER the update is applied
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { reply: reply },
      { new: true, runValidators: true }
    );

    // 3. Handle case where ID doesn't exist
    if (!updatedFeedback) {
      return NextResponse.json(
        { message: "Feedback not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Reply added successfully.",
      feedback: updatedFeedback,
    }, { status: 200 });

  } catch (error) {
    console.error("Reply Feedback Error:", error);
    return NextResponse.json(
      { message: "Failed to add reply.", error: error.message },
      { status: 500 }
    );
  }
}