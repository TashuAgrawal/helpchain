// src/app/api/campaigns/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Feedback from "@/app/lib/models/Feedback";

/**
 * GET /api/campaigns
 * Returns all campaigns sorted by startDate descending.
 */
export async function GET() {
  try {
    await connectDB();

    const feedback = await Feedback.find();

    return NextResponse.json(feedback, { status: 200 });
  } catch (error) {
    console.error("Fetching feedback error:", error);
    return NextResponse.json({ message: "Failed to fetch feedbacks." }, { status: 500 });
  }
}


