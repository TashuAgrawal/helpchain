import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Notification from "@/app/lib/models/Notification";
import Volunteer from "@/app/lib/models/Volunteer";
import CampaignVolunteer from "@/app/lib/models/CampaignVolunteer";

/**
 * POST /api/notifications/volunteer-attendance
 * Updates attendance + stats + notification
 */
export async function POST(request) {
  try {
    await connectDB();

    const { userId, campaignid, attended } = await request.json();

    if (!userId || !campaignid) {
      return NextResponse.json(
        { message: "Missing required fields (userId, campaignid)." },
        { status: 400 }
      );
    }

    // 🔍 1. Update CampaignVolunteer record
    const campaignRecord = await CampaignVolunteer.findOneAndUpdate(
      { campaignId: campaignid, volunteerId: userId },
      { attended },
      { new: true }
    );

    if (!campaignRecord) {
      return NextResponse.json(
        { message: "Campaign volunteer record not found." },
        { status: 404 }
      );
    }

    // 🔍 2. Update Volunteer stats
    const volunteer = await Volunteer.findOne({ userId });

    if (!volunteer) {
      return NextResponse.json(
        { message: "Volunteer not found." },
        { status: 404 }
      );
    }

    let statusText = "not attended";

    if (attended) {
      statusText = "attended";

      volunteer.actuallyVolunteered += 1;
    }

    await volunteer.save();

    // 🔔 3. Create notification
    const notification = await Notification.create({
      userId,
      campaignId: campaignid,
      type: "volunteer_message",
      title: "Attendance Updated",
      message: `Your attendance has been marked as ${statusText}.`,
      isRead: false,
    });

    return NextResponse.json(
      {
        message: "Attendance updated successfully",
        campaignVolunteer: campaignRecord,
        stats: {
          actuallyVolunteered: volunteer.actuallyVolunteered,
        },
        notification,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Attendance Update Error:", error);

    return NextResponse.json(
      { message: "Failed to update attendance." },
      { status: 500 }
    );
  }
}