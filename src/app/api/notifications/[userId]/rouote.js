import { NextResponse } from "next/server";
import Notification from "@/app/lib/models/Notification";
import { connectDB } from "@/app/lib/mongodb";

/**
 * GET /api/notifications/[userId]
 * Fetch all notifications + unread count for a user
 */
export async function GET(request, { params }) {
  try {
    const { userId } = params;

    await connectDB();

    // 🔔 Fetch notifications
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });

    // 📊 Count unread
    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    return NextResponse.json({
      notifications,
      unreadCount,
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}