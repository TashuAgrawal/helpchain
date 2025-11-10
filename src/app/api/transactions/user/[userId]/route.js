// src/app/api/transactions/user/[userId]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Transaction from "@/app/lib/models/Transaction";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ message: "User ID is required." }, { status: 400 });
    }
    const userTransactions = await Transaction.find({ donor: userId }).sort({ date: -1 });

    return NextResponse.json(userTransactions, { status: 200 });
  } catch (error) {
    console.error("Fetching user transactions error:", error);
    return NextResponse.json({ message: "Failed to fetch user transactions." }, { status: 500 });
  }
}
