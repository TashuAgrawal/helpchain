import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Following from "@/app/lib/models/Following";
import Notification from "@/app/lib/models/Notification";

/**
 * POST /api/follow/toggle
 * Toggles follow/unfollow + sends notification on follow
 */
export async function POST(request) {
  try {
    await connectDB();

    const { userId, ngoId } = await request.json();

    if (!userId || !ngoId) {
      return NextResponse.json(
        { message: "Missing required fields (userId, ngoId)." },
        { status: 400 }
      );
    }

    const existingFollow = await Following.findOne({ userId, ngoId });

    // ❌ UNFOLLOW CASE
    if (existingFollow) {
      await Following.deleteOne({ userId, ngoId });

      return NextResponse.json(
        {
          message: "Unfollowed successfully.",
          action: "unfollowed",
        },
        { status: 200 }
      );
    }

    // ✅ FOLLOW CASE
    const follow = new Following({ userId, ngoId });
    await follow.save();

    // 📣 CREATE NOTIFICATION FOR NGO (inline logic)
    try {
      await Notification.create({
        userId: ngoId, // NGO receives notification
        fromUserId: userId,
        type: "follow",
        title: "New Follower",
        message: `User ${userId} started following you.`,
        isRead: false,
      });
    } catch (notifyError) {
      console.error("Follow notification failed:", notifyError.message);
      // ⚠️ don't block follow flow if notification fails
    }

    return NextResponse.json(
      {
        message: "Followed successfully.",
        action: "followed",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Toggle Follow Error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Already following this NGO." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Failed to toggle follow status." },
      { status: 500 }
    );
  }
}