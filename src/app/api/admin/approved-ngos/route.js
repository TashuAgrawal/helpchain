// src/app/api/admin/approved-ngos/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import NGO from "@/app/lib/models/NGO";

/**
 * GET /api/admin/approved-ngos
 * Returns all NGOs with status "approved"
 */
export async function GET() {
  try {
    await connectDB();

    // Find all NGOs where status is 'approved'
    const approvedNgos = await NGO.find({ 
      status: { $in: ["approved", "suspend"]}}
    ).select("-password"); 

    return NextResponse.json(approvedNgos, { status: 200 });
  } catch (error) {
    console.error("Fetching approved NGOs error:", error);
    return NextResponse.json({ message: "Failed to fetch approved NGOs." }, { status: 500 });
  }
}
