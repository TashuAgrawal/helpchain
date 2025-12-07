// src/app/api/ratings/add/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Rating from "@/app/lib/models/Rating";

/**
 * POST /api/ratings/add
 * Adds or updates a rating for an NGO.
 * Expects JSON body with rating, userId, ngoId.
 */
export async function POST(request) {
  try {
    await connectDB();

    const {
      rating,
      userId,
      ngoId,
    } = await request.json();

    if (!rating || !userId || !ngoId) {
      return NextResponse.json({ message: "Missing required fields (rating, userId, ngoId)." }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Rating must be between 1 and 5." }, { status: 400 });
    }

    // Use upsert: create new or update existing rating
    const updatedRating = await Rating.findOneAndUpdate(
      { userId, ngoId },
      { rating, updatedAt: new Date() },
      { 
        upsert: true, 
        new: true,
        runValidators: true 
      }
    );

    return NextResponse.json({ 
      message: "Rating saved successfully.", 
      rating: updatedRating 
    }, { status: 201 });
  } catch (error) {
    console.error("Add Rating Error:", error);
    return NextResponse.json({ message: "Failed to save rating." }, { status: 500 });
  }
}
