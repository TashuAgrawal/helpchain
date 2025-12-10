// src/app/api/transactions/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Transaction from "@/app/lib/models/Transaction";
import NGO from "@/app/lib/models/NGO";

export async function GET() {
  try {
    await connectDB();

    // Step 1: Get all transaction IDs
    const transactions = await Transaction.find().sort({ date: -1 }).lean();
    const ngoIds = [...new Set(transactions.map(t => t.ngo))]; // Unique NGO IDs

    // Step 2: Fetch NGO names by IDs
    const ngos = await NGO.find({ _id: { $in: ngoIds } })
      .select('name _id')
      .lean();
    
    // Step 3: Create NGO lookup map
    const ngoMap = {};
    ngos.forEach(ngo => {
      ngoMap[ngo._id.toString()] = ngo.name;
    });

    // Step 4: Add NGO names to transactions
    const transactionsWithNGO = transactions.map(transaction => ({
      ...transaction,
      ngoName: ngoMap[transaction.ngo] || 'Unknown NGO',
      ngoId: transaction.ngo
    }));

    console.log(transactionsWithNGO);
    

    return NextResponse.json(transactionsWithNGO, { status: 200 });
  } catch (error) {
    console.error("Fetching transactions error:", error);
    return NextResponse.json({ message: "Failed to fetch transactions." }, { status: 500 });
  }
}
