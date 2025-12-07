// src/app/api/follow/toggle/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Following from "@/app/lib/models/Following";

/**
 * POST /api/follow/toggle
 * Toggles follow status for an NGO.
 * If following → unfollow, if not following → follow.
 * Expects JSON body with userId, ngoId.
 */
export async function POST(request) {
  try {
    await connectDB();


    const { userId, ngoId } = await request.json();

    console.log(userId , ngoId);
    

    if (!userId || !ngoId) {
      return NextResponse.json(
        { message: "Missing required fields (userId, ngoId)." }, 
        { status: 400 }
      );
    }

    // Check if already following
    const existingFollow = await Following.findOne({ userId, ngoId });

    console.log(existingFollow);
    

    if (existingFollow) {
      await Following.deleteOne({ userId, ngoId });
      return NextResponse.json(
        { 
          message: "Unfollowed successfully.",
          action: 'unfollowed',
        }, 
        { status: 200 }
      );
    } else {
      const follow = new Following({ userId, ngoId });

      console.log(follow);
      
      await follow.save();

      console.log(123);
      
      
      return NextResponse.json(
        { 
          message: "Followed successfully.",
        }, 
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Toggle Follow Error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Already following this NGO." }, 
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { message: "Failed to toggle follow status." }, 
      { status: 500 }
    );
  }
}
