import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Strike from "@/app/lib/models/Strike";
import Campaign from "@/app/lib/models/Campaign";
import NGO from "@/app/lib/models/NGO";
import { adminAuth } from "@/app/lib/firebaseAdmin";

/**
 * PATCH /api/strikes/[id]/reply
 * NGO submits a defence reply to an accepted strike on one of their campaigns.
 *
 * Body: { reply: string }
 *
 * Only the NGO that owns the campaign can call this.
 * Only strikes in "accepted" status can be replied to.
 */
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    if (decoded.role !== "ngo") {
      return NextResponse.json({ message: "Forbidden. NGOs only." }, { status: 403 });
    }

    const { id } = await params;
    const { reply } = await request.json();

    if (!reply || reply.trim().length < 10) {
      return NextResponse.json(
        { message: "Reply must be at least 10 characters." },
        { status: 400 }
      );
    }

    const strike = await Strike.findById(id).populate("campaignId");
    if (!strike) {
      return NextResponse.json({ message: "Strike not found." }, { status: 404 });
    }

    if (strike.status !== "accepted") {
      return NextResponse.json(
        { message: "You can only reply to accepted strikes." },
        { status: 409 }
      );
    }

    // Confirm the calling NGO owns this campaign
    const ngoId = decoded.mongoId || decoded.uid;
    const campaign = strike.campaignId; // populated
    if (campaign.ngoId.toString() !== ngoId) {
      return NextResponse.json(
        { message: "You are not the NGO that owns this campaign." },
        { status: 403 }
      );
    }

    // Save the reply
    strike.ngoReply = reply.trim();
    strike.repliedAt = new Date();
    await strike.save();

    return NextResponse.json(
      { message: "Reply submitted. Admin will review your response.", strike },
      { status: 200 }
    );
  } catch (error) {
    console.error("NGO Reply Strike Error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
