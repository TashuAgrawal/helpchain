import { NextResponse } from "next/server";
import Notification from "@/app/lib/models/Notification";
import { connectDB } from "@/app/lib/mongodb";

/**
 * PATCH /api/notifications/mark-all-read
 * Body: { userId: string }
 * Marks ALL notifications for a user as read
 */
export async function PATCH(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await connectDB();

    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
