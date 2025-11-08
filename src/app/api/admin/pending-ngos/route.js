// src/app/api/admin/pending-ngos/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import NGO from "@/app/lib/models/NGO";

/**
 * GET /api/admin/pending-ngos
 * Returns all NGOs with status "pending" or "suspended"
 */
export async function GET() {
  try {
    await connectDB();

    // Find NGOs where status is either "pending" or "suspended"
    const pendingNgos = await NGO.find({
      status: { $in: ["pending", "rejected"] }
    }).select("-password"); // Exclude password field for security

    return NextResponse.json(pendingNgos, { status: 200 });
  } catch (error) {
    console.error("Fetching pending NGOs error:", error);
    return NextResponse.json({ message: "Failed to fetch NGOs." }, { status: 500 });
  }
}
