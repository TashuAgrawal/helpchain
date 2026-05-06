import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Notification from "@/app/lib/models/Notification";
import Following from "@/app/lib/models/Following";

/**
 * POST /api/notifications/new-campaign
 * Sends notification to all users who follow the NGO
 */
export async function POST(request) {
  try {
    await connectDB();

    const { ngoId, campaignId, campaignTitle } = await request.json();

    if (!ngoId || !campaignId) {
      return NextResponse.json(
        { message: "Missing required fields (ngoId, campaignId)." },
        { status: 400 }
      );
    }

    // 🎯 Get all followers of NGO
    const followers = await Following.find({ ngoId }).distinct("userId");

    if (!followers.length) {
      return NextResponse.json(
        { message: "No followers found for NGO." },
        { status: 404 }
      );
    }

    // 📢 Create notifications
    const notifications = followers.map((userId) => ({
      userId,
      campaignId,
      type: "new_campaign",
      title: "New Campaign Launched",
      message: campaignTitle
        ? `New campaign started: ${campaignTitle}`
        : "A new campaign has been launched by an NGO you follow.",
      isRead: false,
    }));

    await Notification.insertMany(notifications, { ordered: false });

    return NextResponse.json(
      {
        message: "New campaign notifications sent successfully",
        recipients: followers.length,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("New Campaign Notification Error:", error);

    return NextResponse.json(
      { message: "Failed to send new campaign notifications." },
      { status: 500 }
    );
  }
}