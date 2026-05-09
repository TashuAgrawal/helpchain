import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import CampaignVolunteer from "@/app/lib/models/CampaignVolunteer";
import Volunteer from "@/app/lib/models/Volunteer";
import Notification from "@/app/lib/models/Notification";

/**
 * POST /api/volunteer/respond-request
 * Updates BOTH:
 * 1. CampaignVolunteer (per campaign status)
 * 2. Volunteer (global stats)
 */
export async function POST(request) {
  try {
    await connectDB();

    const { userId, campaignid, action } = await request.json();
    // action = "accepted" | "rejected"

    if (!userId || !campaignid || !action) {
      return NextResponse.json(
        { message: "Missing required fields (userId, campaignid, action)." },
        { status: 400 }
      );
    }

    if (!["accepted", "rejected"].includes(action)) {
      return NextResponse.json(
        { message: "Invalid action." },
        { status: 400 }
      );
    }

    // 🔍 1. Update CampaignVolunteer
    const campaignRecord = await CampaignVolunteer.findOne({
      campaignId: campaignid,
      volunteerId: userId,
    });

    if (!campaignRecord) {
      return NextResponse.json(
        { message: "Request not found." },
        { status: 404 }
      );
    }

    // 🚫 Guard against duplicate responses
    if (campaignRecord.requestStatus !== "pending") {
      return NextResponse.json(
        {
          message: `Request already ${campaignRecord.requestStatus}.`,
          currentStatus: campaignRecord.requestStatus,
        },
        { status: 409 }
      );
    }

    campaignRecord.requestStatus = action;
    await campaignRecord.save();

    // 🔍 2. Update Volunteer stats
    const volunteer = await Volunteer.findOne({ userId });

    if (!volunteer) {
      return NextResponse.json(
        { message: "Volunteer not found." },
        { status: 404 }
      );
    }

    if (action === "accepted") {
      volunteer.requestsAccepted += 1;
    }

    await volunteer.save();

    // 🔔 Notification
    const notification = await Notification.create({
      userId,
      campaignId: campaignid,
      type: "volunteer_message",
      title:
        action === "accepted"
          ? "Request Accepted"
          : "Request Rejected",
      message:
        action === "accepted"
          ? "You have accepted the volunteer request."
          : "You have rejected the volunteer request.",
      isRead: false,
    });

    return NextResponse.json(
      {
        message: `Request ${action} successfully`,
        campaignVolunteer: campaignRecord,
        volunteerStats: {
          requestsReceived: volunteer.requestsReceived,
          requestsAccepted: volunteer.requestsAccepted,
        },
        notification,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Volunteer Response Error:", error);

    return NextResponse.json(
      { message: "Failed to respond to request." },
      { status: 500 }
    );
  }
}