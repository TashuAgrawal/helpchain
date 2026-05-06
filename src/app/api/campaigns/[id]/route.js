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
      { _id: id }
    );
    
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
  ...campaign.toObject(),
  id: campaign._id.toString(),
});
    
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
