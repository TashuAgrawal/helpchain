// src/app/api/community-problems/upvote/user/[userId]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import CommunityProblemUpvote from "@/app/lib/models/CommunityProblemUpvote";
import CommunityProblem from "@/app/lib/models/CommunityProblem";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { userId } = await params;
    if (!userId) {
      return NextResponse.json({ message: "UserId is required" }, { status: 400 });
    }

    // Find all upvotes by user
    const upvotes = await CommunityProblemUpvote.find({ userId }).select("problemId").lean();

    const problemIds = upvotes.map((upvote) => upvote.problemId);

    return NextResponse.json(problemIds, { status: 200 });
  } catch (error) {
    console.error("Fetching upvoted community problems error:", error);
    return NextResponse.json({ message: "Failed to fetch upvoted problems" }, { status: 500 });
  }
}
