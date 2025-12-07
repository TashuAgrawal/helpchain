// src/app/api/ratings/ngo/[ngoid]/user/[userid]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Rating from "@/app/lib/models/Rating";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { ngoid, userid } = params;  

    if (!ngoid || !userid) {
      return NextResponse.json({ 
        message: "NGO ID and User ID are both required in URL." 
      }, { status: 400 });
    }

    const rating = await Rating.findOne({ 
      userId: userid, 
      ngoId: ngoid 
    }).lean();

    return NextResponse.json({ 
      rating: rating || null 
    }, { status: 200 });
  } catch (error) {
    console.error("Fetch User Rating Error:", error);
    return NextResponse.json({ message: "Failed to fetch rating." }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { ngoid, userid } = params;
    const { rating } = await request.json();  

    if (!ngoid || !userid) {
      return NextResponse.json({ 
        message: "NGO ID and User ID are both required in URL." 
      }, { status: 400 });
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ 
        message: "Rating must be a number between 1 and 5." 
      }, { status: 400 });
    }

    const updatedRating = await Rating.findOneAndUpdate(
      { userId: userid, ngoId: ngoid },
      { 
        rating: Number(rating),
        updatedAt: new Date()
      },
      { 
        upsert: true,
        new: true,
        runValidators: true 
      }
    ).lean();

    return NextResponse.json({ 
      message: "Rating updated successfully.",
      rating: updatedRating 
    }, { status: 200 });
  } catch (error) {
    console.error("Update Rating Error:", error);
    return NextResponse.json({ message: "Failed to update rating." }, { status: 500 });
  }
}
