import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Strike from "@/app/lib/models/Strike";
import Campaign from "@/app/lib/models/Campaign";
import { adminAuth } from "@/app/lib/firebaseAdmin";

/**
 * GET /api/strikes/ngo/[ngoId]
 * Returns all strikes against campaigns owned by this NGO.
 * Accessible by the NGO itself or an admin.
 */
export async function GET(request, { params }) {
  try {
    await connectDB();

    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    // Only the NGO itself or admin can access
    const callerId = decoded.mongoId || decoded.uid;
    const { ngoId } = await params;

    if (decoded.role !== "admin" && callerId !== ngoId) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    // Find all campaign IDs belonging to this NGO
    const ngoCampaigns = await Campaign.find({ ngoId }, "_id title isStruck");
    const campaignIds = ngoCampaigns.map((c) => c._id);

    // Get all strikes for those campaigns
    const strikes = await Strike.find({ campaignId: { $in: campaignIds } })
      .populate("campaignId", "title isStruck")
      .sort({ createdAt: -1 });

    return NextResponse.json({ strikes }, { status: 200 });
  } catch (error) {
    console.error("Get NGO Strikes Error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
