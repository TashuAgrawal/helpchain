// src/app/api/solutions/ngo/[ngoId]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Solution from "@/app/lib/models/Solution";

export async function GET(request,{ params } ) {
  try {
    await connectDB();

    const { ngoId } = params;

    // Fetch ONLY problem IDs for this NGO
    const problemIds = await Solution.distinct('problemId', { ngoId })
      .lean();

    return NextResponse.json({
      ngoId,
      problemIds: problemIds.map(id => id.toString()), // Convert ObjectId to string
      count: problemIds.length
    }, { status: 200 });

  } catch (error) {
    console.error("Fetching NGO submitted problems error:", error);
    return NextResponse.json(
      { message: "Failed to fetch submitted problems.", error: error.message },
      { status: 500 }
    );
  }
}
