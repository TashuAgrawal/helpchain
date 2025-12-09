// src/app/api/campaign/update-raised/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Campaign from "@/app/lib/models/Campaign";

/**
 * POST /api/campaign/update-raised
 * Body: { campaignId, amount }
 * Effect: campaign.raised += amount
 */
export async function POST(request) {
  try {
    await connectDB();

    const { campaignId, amount } = await request.json();

    if (!campaignId || typeof amount !== "number") {
      return NextResponse.json(
        { message: "Missing or invalid fields (campaignId, amount)." },
        { status: 400 }
      );
    }

    // Increment raised by amount
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaignId,
      { $inc: { raised: amount,donors: 1 } }, 
      { new: true }
    );

    if (!updatedCampaign) {
      return NextResponse.json(
        { message: "Campaign not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Campaign updated successfully.",
        campaign: updatedCampaign,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Campaign Raised Error:", error);
    return NextResponse.json(
      { message: "Failed to update campaign raised amount." },
      { status: 500 }
    );
  }
}
