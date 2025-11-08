// src/app/api/transactions/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Transaction from "@/app/lib/models/Transaction";

export async function GET() {
  try {
    await connectDB();

    const transactions = await Transaction.find().sort({ date: -1 }); // Sorted by date descending

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Fetching transactions error:", error);
    return NextResponse.json({ message: "Failed to fetch transactions." }, { status: 500 });
  }
}
