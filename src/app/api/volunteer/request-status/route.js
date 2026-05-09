import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import CampaignVolunteer from "@/app/lib/models/CampaignVolunteer";

/**
 * GET /api/volunteer/request-status?userId=&campaignId=
 * Returns the CampaignVolunteer requestStatus for a given user+campaign pair
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const campaignId = searchParams.get("campaignId");

    if (!userId || !campaignId) {
      return NextResponse.json(
        { message: "userId and campaignId are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const record = await CampaignVolunteer.findOne({
      volunteerId: userId,
      campaignId,
    });

    if (!record) {
      return NextResponse.json(
        { status: "pending" }, // default if no record found
        { status: 200 }
      );
    }

    return NextResponse.json({
      status: record.requestStatus,   // "pending" | "accepted" | "rejected"
      attended: record.attended,
      campaignId: record.campaignId,
      volunteerId: record.volunteerId,
    });

  } catch (error) {
    console.error("Request Status Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch request status." },
      { status: 500 }
    );
  }
}
