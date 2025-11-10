// src/app/api/community-problems/upvote/toggle/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import CommunityProblemUpvote from "@/app/lib/models/CommunityProblemUpvote";
import CommunityProblem from "@/app/lib/models/CommunityProblem";

export async function POST(request) {
  try {
    await connectDB();

    const { userId, problemId } = await request.json();

    if (!userId || !problemId) {
      return NextResponse.json(
        { message: "userId and problemId are required." },
        { status: 400 }
      );
    }

    // Check if upvote already exists
    const existingUpvote = await CommunityProblemUpvote.findOne({
      userId,
      problemId,
    });

    if (existingUpvote) {
      // Remove upvote
      await CommunityProblemUpvote.deleteOne({ _id: existingUpvote._id });

      // Decrement upvotes count (minimum 0)
      await CommunityProblem.updateOne(
        { _id: problemId, upvotes: { $gt: 0 } },
        { $inc: { upvotes: -1 } }
      );
      return NextResponse.json(
        { message: "Upvote removed", upvoted: false },
        { status: 200 }
      );
    } else {
      // Add upvote
      const newUpvote = new CommunityProblemUpvote({ userId, problemId });
      await newUpvote.save();

      // Increment upvotes count
      await CommunityProblem.updateOne(
        { _id: problemId },
        { $inc: { upvotes: 1 } }
      );

      return NextResponse.json(
        { message: "Upvote added", upvoted: true },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Toggle upvote error:", error);
    return NextResponse.json(
      { message: "Failed to toggle upvote" },
      { status: 500 }
    );
  }
}
