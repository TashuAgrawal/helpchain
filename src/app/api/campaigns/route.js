// src/app/api/campaigns/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Campaign from "@/app/lib/models/Campaign";

/**
 * GET /api/campaigns
 * Returns all campaigns sorted by startDate descending.
 */
export async function GET() {
  try {
    await connectDB();

    const campaigns = await Campaign.find().sort({ startDate: -1 });

    return NextResponse.json(campaigns, { status: 200 });
  } catch (error) {
    console.error("Fetching campaigns error:", error);
    return NextResponse.json({ message: "Failed to fetch campaigns." }, { status: 500 });
  }
}
