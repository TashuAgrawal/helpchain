import { NextResponse } from "next/server";
import Notification from "@/app/lib/models/Notification";
import { connectDB } from "@/app/lib/mongodb";

/**
 * DELETE /api/notifications/delete
 * Delete selected notifications or all notifications for a user
 */
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { notificationIds, userId, deleteAll } = body;

    await connectDB();

    if (deleteAll && userId) {
      // Delete all notifications for the user
      await Notification.deleteMany({ userId });
      return NextResponse.json({ message: "All notifications deleted successfully" }, { status: 200 });
    } else if (notificationIds && Array.isArray(notificationIds) && notificationIds.length > 0) {
      // Delete selected notifications
      await Notification.deleteMany({ _id: { $in: notificationIds } });
      return NextResponse.json({ message: "Selected notifications deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

  } catch (error) {
    console.error("Error deleting notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
