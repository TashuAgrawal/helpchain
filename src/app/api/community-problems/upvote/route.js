// src/app/api/community-problems/upvote/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import CommunityProblem from "@/app/lib/models/CommunityProblem";

/**
 * POST /api/community-problems/upvote
 * Request body: { problemId: string }
 * Increments the upvote count for the given community problem.
 */
export async function POST(request) {
  try {
    await connectDB();

    const { problemId } = await request.json();

    if (!problemId) {
      return NextResponse.json({ message: "problemId is required." }, { status: 400 });
    }

    const problem = await CommunityProblem.findById(problemId);

    if (!problem) {
      return NextResponse.json({ message: "Community problem not found." }, { status: 404 });
    }

    problem.upvotes += 1;
    await problem.save();

    return NextResponse.json({ message: "Upvoted successfully.", upvotes: problem.upvotes }, { status: 200 });
  } catch (error) {
    console.error("Upvote error:", error);
    return NextResponse.json({ message: "Failed to upvote community problem." }, { status: 500 });
  }
}
