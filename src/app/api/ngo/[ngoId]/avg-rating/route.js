// src/app/api/ngo/[ngoId]/avg-rating/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Rating from "@/app/lib/models/Rating";
import mongoose from "mongoose";

/**
 * GET /api/ngo/[ngoId]/avg-rating
 * Path params: /api/ngo/69368e5da0c1e913356b238f/avg-rating
 * Returns: Average rating and rating stats for NGO
 */
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { ngoId } = params;

    if (!ngoId) {
      return NextResponse.json(
        { message: "Missing path parameter (ngoId)." },
        { status: 400 }
      );
    }

    console.log("ngoId from params:", ngoId);

    // ✅ CONVERT STRING TO OBJECTID
    const objectId = new mongoose.Types.ObjectId(ngoId);

    // Calculate average rating for this NGO
    const ratingStats = await Rating.aggregate([
      { 
        $match: { 
          ngoId: objectId  // ✅ Proper ObjectId matching
        } 
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
          ratings: { $push: "$rating" }
        }
      }
    ]);

    const stats = ratingStats[0] || { averageRating: 0, totalRatings: 0, ratings: [] };

    return NextResponse.json(
      {
        message: "Average rating fetched successfully.",
        averageRating: parseFloat(stats.averageRating?.toFixed(1)) || 0,
        totalRatings: stats.totalRatings,
        ratingDistribution: {
          5: stats.ratings.filter(r => r === 5).length,
          4: stats.ratings.filter(r => r === 4).length,
          3: stats.ratings.filter(r => r === 3).length,
          2: stats.ratings.filter(r => r === 2).length,
          1: stats.ratings.filter(r => r === 1).length,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch NGO Average Rating Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch average rating." },
      { status: 500 }
    );
  }
}
