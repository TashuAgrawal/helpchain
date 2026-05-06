import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Campaign from "@/app/lib/models/Campaign";
import Notification from "@/app/lib/models/Notification";
import Following from "@/app/lib/models/Following";

/**
 * POST /api/campaigns/add
 * Adds campaign + sends notifications to followers
 */
export async function POST(request) {
  try {
    await connectDB();

    const {
      title,
      goal,
      raised = 0,
      donors = 0,
      status,
      lastUpdate,
      description = "",
      startDate,
      endDate,
      ngoId,
    } = await request.json();

    if (!title || !goal || !status || !lastUpdate || !startDate || !ngoId) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const newCampaign = new Campaign({
      title,
      goal,
      raised,
      donors,
      status,
      lastUpdate,
      description,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      ngoId,
    });

    await newCampaign.save();

    // 📣 Fetch followers of NGO
    const followers = await Following.find({ ngoId }).distinct("userId");

    // 🚨 If followers exist, create notifications
    if (followers.length > 0) {
      const notifications = followers.map((userId) => ({
        userId,
        campaignId: newCampaign._id,
        type: "new_campaign",
        title: "New Campaign Launched",
        message: `New campaign started: ${title}`,
        isRead: false,
      }));

      await Notification.insertMany(notifications, { ordered: false });
    }

    return NextResponse.json(
      {
        message: "Campaign created successfully.",
        campaign: newCampaign,
        notificationsSent: followers.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add Campaign Error:", error);

    return NextResponse.json(
      { message: "Failed to create campaign." },
      { status: 500 }
    );
  }
}