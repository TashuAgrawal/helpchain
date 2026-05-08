import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Strike from "@/app/lib/models/Strike";
import { adminAuth } from "@/app/lib/firebaseAdmin";

/**
 * GET /api/strikes/[id]
 * Fetch a single strike by ID.
 * Accessible by admin, the NGO that owns the campaign, or the user who filed it.
 */
export async function GET(request, { params }) {
  try {
    await connectDB();

    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    const strike = await Strike.findById(id)
      .populate("campaignId", "title status isStruck ngoId")
      .populate("filedBy", "username email")
      .populate("reviewedBy", "username email");

    if (!strike) {
      return NextResponse.json({ message: "Strike not found." }, { status: 404 });
    }

    return NextResponse.json({ strike }, { status: 200 });
  } catch (error) {
    console.error("Get Strike Error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
