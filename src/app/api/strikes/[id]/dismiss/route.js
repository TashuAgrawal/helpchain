import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Strike from "@/app/lib/models/Strike";
import Campaign from "@/app/lib/models/Campaign";
import { adminAuth } from "@/app/lib/firebaseAdmin";

/**
 * DELETE /api/strikes/[id]/dismiss
 * Admin deletes (removes) an accepted strike after reviewing the NGO's reply.
 * This also unlocks the campaign (isStruck → false).
 *
 * Use this when the admin determines the NGO's defence is valid.
 */
export async function DELETE(request, { params }) {
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

    const strike = await Strike.findById(id);
    if (!strike) {
      return NextResponse.json({ message: "Strike not found." }, { status: 404 });
    }

    // Record the campaign ID before deleting
    const campaignId = strike.campaignId;

    // Remove the strike document
    await Strike.findByIdAndDelete(id);

    // Unlock the campaign only if no other accepted strikes remain for it
    const otherAcceptedStrikes = await Strike.countDocuments({
      campaignId,
      status: "accepted",
    });

    if (otherAcceptedStrikes === 0) {
      await Campaign.findByIdAndUpdate(campaignId, { isStruck: false });
    }

    return NextResponse.json(
      {
        message:
          otherAcceptedStrikes === 0
            ? "Strike removed and campaign has been unlocked."
            : "Strike removed. Campaign remains locked due to other active strikes.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dismiss Strike Error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
