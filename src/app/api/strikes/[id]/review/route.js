import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Strike from "@/app/lib/models/Strike";
import Campaign from "@/app/lib/models/Campaign";
import { adminAuth } from "@/app/lib/firebaseAdmin";

/**
 * PATCH /api/strikes/[id]/review
 * Admin accepts or rejects a strike.
 *
 * Body: { action: "accept" | "reject", adminNote?: string }
 *
 * If action is "accept":
 *   - Strike status → "accepted"
 *   - Campaign isStruck → true  (campaign is now locked)
 *
 * If action is "reject":
 *   - Strike status → "rejected"
 *   - Campaign isStruck stays false (or is re-set to false if it was previously struck)
 */
export async function PATCH(request, { params }) {
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

    const { id } = await params;
    const { action, adminNote } = await request.json();

    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json(
        { message: "action must be 'accept' or 'reject'." },
        { status: 400 }
      );
    }

    const strike = await Strike.findById(id);
    if (!strike) {
      return NextResponse.json({ message: "Strike not found." }, { status: 404 });
    }

    if (strike.status !== "pending") {
      return NextResponse.json(
        { message: `Strike has already been ${strike.status}.` },
        { status: 409 }
      );
    }

    const adminId = decoded.mongoId || decoded.uid;
    const newStatus = action === "accept" ? "accepted" : "rejected";

    // Update the strike
    strike.status = newStatus;
    strike.reviewedBy = adminId;
    strike.adminNote = adminNote || "";
    strike.reviewedAt = new Date();
    await strike.save();

    // Lock the campaign if accepted
    if (action === "accept") {
      await Campaign.findByIdAndUpdate(strike.campaignId, { isStruck: true });
    }

    return NextResponse.json(
      {
        message:
          action === "accept"
            ? "Strike accepted. Campaign has been locked and NGO has been notified."
            : "Strike rejected.",
        strike,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Review Strike Error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
