// src/app/api/campaigns/add/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Campaign from "@/app/lib/models/Campaign";

/**
 * POST /api/campaigns/add
 * Adds a new campaign.
 * Expects JSON body with title, goal, status, lastUpdate, startDate, ngoId,
 * and optional fields: raised, donors, description, endDate.
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
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
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

    return NextResponse.json({ message: "Campaign created successfully.", campaign: newCampaign }, { status: 201 });
  } catch (error) {
    console.error("Add Campaign Error:", error);
    return NextResponse.json({ message: "Failed to create campaign." }, { status: 500 });
  }
}
