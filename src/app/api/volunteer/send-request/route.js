import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Volunteer from "@/app/lib/models/Volunteer";
import CampaignVolunteer from "@/app/lib/models/CampaignVolunteer";
import Notification from "@/app/lib/models/Notification";

/**
 * POST /api/volunteer/send-request
 * Sends request + notification + updates stats
 */
export async function POST(request) {
  try {
    await connectDB();

    const { campaignId, pincode } = await request.json();

    if (!campaignId || !pincode) {
      return NextResponse.json(
        { message: "Missing required fields (campaignId, pincode)." },
        { status: 400 }
      );
    }

    const pin = parseInt(pincode);

    const minPin = pin - 3;
    const maxPin = pin + 3;

    // 🔍 Find active volunteers in range
    const volunteers = await Volunteer.find({
      pincode: { $gte: String(minPin), $lte: String(maxPin) },
      isCurrently: true,
    });

    if (volunteers.length === 0) {
      return NextResponse.json(
        { message: "No active volunteers found in range." },
        { status: 404 }
      );
    }

    // 📨 1. Create CampaignVolunteer entries
    const requests = volunteers.map((vol) => ({
      campaignId,
      volunteerId: vol.userId,
      requestStatus: "pending",
      attended: false,
    }));

    await CampaignVolunteer.insertMany(requests, { ordered: false });

    // 📊 2. Update requestsReceived count (IMPORTANT FIX)
    const volunteerIds = volunteers.map((v) => v.userId);

    await Volunteer.updateMany(
      { userId: { $in: volunteerIds } },
      { $inc: { requestsReceived: 1 } }
    );

    // 🔔 3. Notifications
    const notifications = volunteers.map((vol) => ({
      userId: vol.userId,
      campaignId,
      type: "campaign_request",
      title: "Volunteer Request",
      message: "You have been invited to volunteer for a nearby campaign.",
      isRead: false,
    }));

    await Notification.insertMany(notifications, { ordered: false });

    return NextResponse.json(
      {
        message: "Requests, stats, and notifications sent successfully.",
        totalVolunteers: volunteers.length,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Send Request Error:", error);

    return NextResponse.json(
      { message: "Failed to send requests." },
      { status: 500 }
    );
  }
}