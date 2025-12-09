// src/app/api/follow/[userId]/[ngoId]/check/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Following from "@/app/lib/models/Following";

/**
 * GET /api/follow/[userId]/[ngoId]/check
 * Path params: /api/follow/64f.../64e.../check
 * Returns: { isFollowing: true/false, followerCount: number }
 */

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { userid, ngoid } = params;

    if (!userid || !ngoid) {
      return NextResponse.json(
        { message: "Missing path parameters (userId, ngoId)." },
        { status: 400 }
      );
    }

    // Check if user is following this NGO
    const isFollowingRecord = await Following.findOne({ userId:userid, ngoId:ngoid });
    const isFollowing = !!isFollowingRecord;

    // Get total follower count for this NGO
    const followerCount = await Following.countDocuments({ ngoId:ngoid });

    return NextResponse.json(
      {
        message: "Follow status checked successfully.",
        isFollowing,
        followerCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Check Follow Status Error:", error);
    return NextResponse.json(
      { message: "Failed to check follow status." },
      { status: 500 }
    );
  }
}
