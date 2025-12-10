// src/app/api/solutions/route.js - GROUPED BY PROBLEM ID

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Solution from "@/app/lib/models/Solution";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { problemId, solutionDescription, estimatedCost, timeline, ngoId } = body;

    // Basic Validation
    if (!problemId || !solutionDescription || !timeline || !estimatedCost || !ngoId) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const solution = await Solution.create({
      problemId,
      ngoId,
      solutionDescription,
      estimatedCost,
      timeline,
      title: "temp"
    });

    return NextResponse.json(
      { success: true, data: solution },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error in /api/solutions:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ GROUPED BY PROBLEM ID
export async function GET() {
  try {
    await connectDB();

    // Group solutions by problemId using aggregation
    const solutionsByProblem = await Solution.aggregate([
      {
        $group: {
          _id: "$problemId",  // Group by problemId
          solutions: {
            $push: {
              _id: "$_id",
              ngoId: "$ngoId",
              // ngoName: "$ngoName", 
              solutionDescription: "$solutionDescription",
              estimatedCost: "$estimatedCost",
              timeline: "$timeline",
              status: "$status",
              submittedAt: "$submittedAt"
            }
          },
          count: { $sum: 1 }  // Count solutions per problem
        }
      },
      {
        $sort: { "solutions.0.submittedAt": -1 }  // Sort by latest solution
      },
      {
        $limit: 100  // Reasonable limit
      }
    ]);

    return NextResponse.json({
      success: true,
      groupedSolutions: solutionsByProblem,
      totalGroups: solutionsByProblem.length
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching grouped solutions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch solutions" },
      { status: 500 }
    );
  }
}
