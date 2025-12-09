// src/app/api/ngo/[ngoId]/feedback/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Feedback from "@/app/lib/models/Feedback";
import User from "@/app/lib/models/User";
import mongoose from "mongoose";

/**
 * GET /api/ngo/[ngoId]/feedback
 * Fetches feedback + converts userId → username
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

    const objectId = new mongoose.Types.ObjectId(ngoId);

    // Fetch feedback with populated user details
    const feedbackList = await Feedback.find({ ngoId: objectId })
      .populate('userId', 'username')  // ✅ Populate USERNAME field
      .sort({ createdAt: -1 })
      .limit(50);

    // ✅ MAP TO YOUR INTERFACE - userId → username
    const mappedFeedback = await Promise.all(
      feedbackList.map(async (fb) => {
        let donor = "Anonymous";
        
        // ✅ Extract USERNAME from populated userId
        if (fb.userId && fb.userId.username) {
          donor = fb.userId.username;  // ✅ username field
        } else if (fb.userId) {
          // Fallback: fetch user if populate failed
          try {
            const user = await User.findById(fb.userId).select('username');
            donor = user?.username || "Unknown Donor";
          } catch (error) {
            console.error(`Error fetching user ${fb.userId}:`, error);
          }
        }

        return {
          id: fb._id.toString(),
          donor,                           // ✅ userId → USERNAME
          comment: fb.text,
          date: new Date(fb.createdAt).toLocaleDateString(),
          replied: fb.replied || false,
          rating: fb.rating || 0
        };
      })
    );

    const totalFeedback = await Feedback.countDocuments({ ngoId: objectId });

    return NextResponse.json(
      {
        message: "Feedback fetched successfully.",
        feedback: mappedFeedback,
        totalFeedback
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch NGO Feedback Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch feedback." },
      { status: 500 }
    );
  }
}
