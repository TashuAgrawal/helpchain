// src/app/api/campaigns/[id]/route.ts

import {  NextResponse } from 'next/server';
import { connectDB } from "@/app/lib/mongodb";
import Campaign from "@/app/lib/models/Campaign";

export async function GET(
  NextRequest,
  { params } 
) {
  try {
    const { id } = params;

    
    await connectDB();
    
    // Fetch campaign by ID
    const campaign = await Campaign.findOne(
      { _id: id },
      { projection: { 
        title: 1, description: 1, goal: 1, raised: 1, 
        status: 1, startDate: 1, endDate: 1, 
        donors: 1, lastUpdate: 1, image: 1 
      } }
    );
    
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    // Convert MongoDB _id to string id
    const campaignData = {
      id: campaign._id.toString(),
      ...campaign
    };
    
    return NextResponse.json(campaignData);
    
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
