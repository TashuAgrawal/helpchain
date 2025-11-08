// src/app/api/community-problems/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import CommunityProblem from "@/app/lib/models/CommunityProblem";

/**
 * GET /api/community-problems
 * Returns all community problems sorted by date descending.
 */
export async function GET() {
  try {
    await connectDB();

    const problems = await CommunityProblem.find().sort({ date: -1 });

    return NextResponse.json(problems, { status: 200 });
  } catch (error) {
    console.error("Fetching community problems error:", error);
    return NextResponse.json({ message: "Failed to fetch community problems." }, { status: 500 });
  }
}
