import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Notification from "@/app/lib/models/Notification";
import Transaction from "@/app/lib/models/Transaction";
import Following from "@/app/lib/models/Following";

/**
 * POST /api/notifications/campaign-post
 * Sends notification when NGO adds a new post in a campaign
 * Audience:
 * 1. Donors of campaign
 * 2. Followers of NGO
 */
export async function POST(request) {
  try {
    await connectDB();

    const { campaignid, ngoId, postTitle } = await request.json();

    if (!campaignid || !ngoId) {
      return NextResponse.json(
        { message: "Missing required fields (campaignid, ngoId)." },
        { status: 400 }
      );
    }

    // 🎯 1. Donors of campaign
    const donors = await Transaction.find({ campaignid })
      .distinct("donor");

    // 🎯 2. NGO followers
    const followers = await Following.find({ ngoId })
      .distinct("userId");

    // 🧠 Merge + deduplicate
    const audience = Array.from(new Set([...donors, ...followers]));

    if (!audience.length) {
      return NextResponse.json(
        { message: "No users to notify." },
        { status: 404 }
      );
    }

    // 📢 Notifications
    const notifications = audience.map((userId) => ({
      userId,
      campaignId: campaignid,
      type: "campaign_post",
      title: "New Campaign Update Post",
      message: postTitle
        ? `New post added: ${postTitle}`
        : "A new update post was added to a campaign you follow.",
      isRead: false,
    }));

    await Notification.insertMany(notifications);

    return NextResponse.json(
      {
        message: "Campaign post notifications sent successfully",
        recipients: audience.length,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Campaign Post Notification Error:", error);

    return NextResponse.json(
      { message: "Failed to send campaign post notifications." },
      { status: 500 }
    );
  }
}