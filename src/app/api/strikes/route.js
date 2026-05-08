import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Strike from "@/app/lib/models/Strike";
import Campaign from "@/app/lib/models/Campaign";
import { adminAuth } from "@/app/lib/firebaseAdmin";

/**
 * POST /api/strikes
 * Any authenticated user files a strike against a campaign.
 * Body: { campaignId, reason, details? }
 */
export async function POST(request) {
  try {
    await connectDB();

    // Authenticate the user
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const userId = decoded.mongoId || decoded.uid;

    const { campaignId, reason, details } = await request.json();

    if (!campaignId || !reason) {
      return NextResponse.json(
        { message: "campaignId and reason are required." },
        { status: 400 }
      );
    }

    // Verify campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json({ message: "Campaign not found." }, { status: 404 });
    }

    // Prevent duplicate pending strike by the same user on the same campaign
    const existing = await Strike.findOne({
      campaignId,
      filedBy: userId,
      status: "pending",
    });
    if (existing) {
      return NextResponse.json(
        { message: "You already have a pending strike on this campaign." },
        { status: 409 }
      );
    }

    const strike = await Strike.create({
      campaignId,
      filedBy: userId,
      reason,
      details: details || "",
    });

    return NextResponse.json(
      { message: "Strike filed successfully. It is under admin review.", strike },
      { status: 201 }
    );
  } catch (error) {
    console.error("File Strike Error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

/**
 * GET /api/strikes
 * Admin fetches all strikes (with campaign + user info).
 * Optionally filter by ?status=pending|accepted|rejected
 */
export async function GET(request) {
  try {
    await connectDB();

    // Admin-only
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden. Admins only." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    const query = statusFilter ? { status: statusFilter } : {};

    const strikes = await Strike.find(query)
      .populate("campaignId", "title status isStruck ngoId")
      .populate("filedBy", "username email")
      .populate("reviewedBy", "username email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ strikes }, { status: 200 });
  } catch (error) {
    console.error("Get Strikes Error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
