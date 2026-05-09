import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Notification from "@/app/lib/models/Notification";
import Transaction from "@/app/lib/models/Transaction";
import Following from "@/app/lib/models/Following";

/**
 * POST /api/notifications/campaign-update
 * Sends update to:
 * 1. All donors of campaign
 * 2. All users following the NGO
 */
export async function POST(request) {
  try {
    await connectDB();

    const { campaignId, ngoId, updateMessage } = await request.json();

    if (!campaignId || !ngoId) {
      return NextResponse.json(
        { message: "Missing required fields (campaignId, ngoId)." },
        { status: 400 }
      );
    }

    // 🎯 1. Get all donors for this campaign
    const donors = await Transaction.find({ campaignId })
      .distinct("userId");

    // 🎯 2. Get all followers of NGO
    const followers = await Following.find({ ngoId })
      .distinct("userId");

    // 🧠 Merge + remove duplicates
    const audienceSet = new Set([...donors, ...followers]);
    const audience = Array.from(audienceSet);

    if (!audience.length) {
      return NextResponse.json(
        { message: "No users to notify." },
        { status: 404 }
      );
    }

    // 📢 Create notifications
    const notifications = audience.map((userId) => ({
      userId,
      campaignId,
      type: "campaign_update",
      title: "Campaign Updated",
      message: updateMessage || "A campaign you supported has been updated.",
      isRead: false,
    }));

    await Notification.insertMany(notifications);

    return NextResponse.json(
      {
        message: "Campaign update notifications sent",
        recipients: audience.length,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Campaign Update Error:", error);

    return NextResponse.json(
      { message: "Failed to send campaign update notifications." },
      { status: 500 }
    );
  }
}