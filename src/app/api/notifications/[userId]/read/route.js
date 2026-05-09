import { NextResponse } from "next/server";
import Notification from "@/app/lib/models/Notification";
import { connectDB } from "@/app/lib/mongodb";

/**
 * PATCH /api/notifications/[userId]/read
 * Here [userId] is actually the notification _id when called for marking read.
 * We re-use the same dynamic segment since Next.js requires consistent slug names.
 */
export async function PATCH(request, { params }) {
  try {
    const { userId: notificationId } = await params;

    await connectDB();

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
