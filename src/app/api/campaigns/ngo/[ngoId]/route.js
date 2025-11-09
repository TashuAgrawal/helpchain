// src/app/api/campaigns/ngo/[ngoId]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Campaign from "@/app/lib/models/Campaign";

/**
 * GET /api/campaigns/ngo/:ngoId
 * Returns all campaigns posted by the given NGO ID.
 */
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { ngoId } = await params;

    if (!ngoId) {
      return NextResponse.json({ message: "NGO ID is required." }, { status: 400 });
    }

    // Fetch campaigns where ngoId matches
    const campaigns = await Campaign.find({ ngoId }).sort({ startDate: -1 });

    return NextResponse.json(campaigns, { status: 200 });
  } catch (error) {
    console.error("Fetching campaigns by NGO error:", error);
    return NextResponse.json({ message: "Failed to fetch campaigns." }, { status: 500 });
  }
}
