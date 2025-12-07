// src/app/api/feedback/add/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Feedback from "@/app/lib/models/Feedback";

/**
 * POST /api/feedback/add
 * Adds a new feedback for an NGO.
 * Expects JSON body with text, userId, ngoId.
 */
export async function POST(request) {
  try {
    await connectDB();

    const {
      text,
      userId,
      ngoId,
    } = await request.json();

    if (!text || !userId || !ngoId) {
      return NextResponse.json({ message: "Missing required fields (text, userId, ngoId)." }, { status: 400 });
    }

    const newFeedback = new Feedback({
      text,
      userId,
      ngoId,
    });

    await newFeedback.save();

    return NextResponse.json({ 
      message: "Feedback created successfully.", 
      feedback: newFeedback 
    }, { status: 201 });
  } catch (error) {
    console.error("Add Feedback Error:", error);
    
    // Handle duplicate key error gracefully (if you add unique constraint later)
    if (error.code === 11000) {
      return NextResponse.json({ 
        message: "Feedback already exists for this user and NGO." 
      }, { status: 409 });
    }
    
    return NextResponse.json({ message: "Failed to create feedback." }, { status: 500 });
  }
}
