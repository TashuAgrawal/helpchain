// src/app/api/transactions/add/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Transaction from "@/app/lib/models/Transaction";

export async function POST(request) {
  try {
    await connectDB();

    const { donor, ngo, amount, date, status, utilization, category } = await request.json();

    // Basic validation
    if (!donor || !ngo || !amount ) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    const newTransaction = new Transaction({
      donor,
      ngo,
      amount,
      status,
      utilization,
      category,
    });

    await newTransaction.save();

    return NextResponse.json({ message: "Transaction added successfully.", transaction: newTransaction }, { status: 201 });
  } catch (error) {
    console.error("Add Transaction Error:", error);
    return NextResponse.json({ message: "Failed to add transaction." }, { status: 500 });
  }
}
