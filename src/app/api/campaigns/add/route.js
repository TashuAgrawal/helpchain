import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Campaign from "@/app/lib/models/Campaign";
import Notification from "@/app/lib/models/Notification";
import Following from "@/app/lib/models/Following";
import Volunteer from "@/app/lib/models/Volunteer";
import CampaignVolunteer from "@/app/lib/models/CampaignVolunteer";

/**
 * POST /api/campaigns/add
 * Adds campaign + sends notifications to followers + nearby volunteers
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
      pincode,
    } = await request.json();

    if (
      !title ||
      !goal ||
      !status ||
      !lastUpdate ||
      !startDate ||
      !ngoId ||
      !pincode
    ) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // 🆕 Create Campaign
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
      pincode,
    });

    await newCampaign.save();

    // =========================
    // 📣 1. Notify Followers
    // =========================
    const followers = await Following.find({ ngoId }).distinct("userId");

    if (followers.length > 0) {
      const followerNotifications = followers.map((userId) => ({
        userId,
        campaignId: newCampaign._id,
        type: "new_campaign",
        title: "New Campaign Launched",
        message: `New campaign started: ${title}`,
        isRead: false,
      }));

      await Notification.insertMany(followerNotifications, {
        ordered: false,
      });
    }

    // =========================
    // 📍 2. Notify Nearby Volunteers
    // =========================
    const pin = parseInt(pincode);
    const minPin = pin - 3;
    const maxPin = pin + 3;

    const volunteers = await Volunteer.find({
      pincode: { $gte: String(minPin), $lte: String(maxPin) },
      isCurrently: true,
    });

    let volunteerCount = 0;

    if (volunteers.length > 0) {
      volunteerCount = volunteers.length;

      // 📨 Create CampaignVolunteer entries
      const requests = volunteers.map((vol) => ({
        campaignId: newCampaign._id,
        volunteerId: vol.userId,
        requestStatus: "pending",
        attended: false,
      }));

      await CampaignVolunteer.insertMany(requests, { ordered: false });

      // 📊 Update request stats
      const volunteerIds = volunteers.map((v) => v.userId);

      await Volunteer.updateMany(
        { userId: { $in: volunteerIds } },
        { $inc: { requestsReceived: 1 } }
      );

      // 🔔 Notifications to volunteers
      const volunteerNotifications = volunteers.map((vol) => ({
        userId: vol.userId,
        campaignId: newCampaign._id,
        type: "campaign_request",
        title: "New Volunteer Opportunity",
        message: `A campaign near you needs volunteers: ${title}`,
        isRead: false,
      }));


      await Notification.insertMany(volunteerNotifications, {
        ordered: false,
      });
    }

    // =========================
    // ✅ Final Response
    // =========================
    return NextResponse.json(
      {
        message:
          "Campaign created + notifications sent to followers and volunteers.",
        campaign: newCampaign,
        followersNotified: followers.length,
        volunteersNotified: volunteerCount,
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