import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Notification from "@/app/lib/models/Notification";

/**
 * POST /api/notifications/ngo-follow
 * Sends notification to NGO when a user follows them
 */
export async function POST(request) {
  try {
    await connectDB();

    const { ngoId, userId } = await request.json();

    if (!ngoId || !userId) {
      return NextResponse.json(
        { message: "Missing required fields (ngoId, userId)." },
        { status: 400 }
      );
    }

    const notification = await Notification.create({
      userId: ngoId, // NGO receives it
      fromUserId: userId, // follower
      type: "follow",
      title: "New Follow Request",
      message: `You got a follow request from user ${userId}`,
      isRead: false,
    });

    return NextResponse.json(
      {
        message: "NGO follow notification created",
        notification,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("NGO Follow Notification Error:", error);

    return NextResponse.json(
      { message: "Failed to create NGO follow notification." },
      { status: 500 }
    );
  }
}