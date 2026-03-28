// src/app/api/campaigns/[id]/transactions/route.ts

import {  NextResponse } from 'next/server';
import Transaction from "@/app/lib/models/Transaction";
import { connectDB } from "@/app/lib/mongodb";

export async function GET(
  request,{ params }
) {
  try {
    const { id } = params;
    
    await connectDB();
    
    // Fetch transactions for this campaign
    const transactions = await Transaction
      .find({ 
        campaignId: id
      })
    
    
    return NextResponse.json({
      transactions
    });
    
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
