// src/app/api/transactions/ngo/[ngoId]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Transaction from "@/app/lib/models/Transaction"; 

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { ngoId } = await params;
    if (!ngoId) {
      return NextResponse.json({ message: "ngoId is required" }, { status: 400 });
    }

    // Find all donations to this NGO
    const transactions = await Transaction.find({ ngo: ngoId }).lean();
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions for NGO:", error);
    return NextResponse.json({ message: "Failed to fetch transactions" }, { status: 500 });
  }
}
