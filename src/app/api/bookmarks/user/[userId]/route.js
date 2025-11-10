// src/app/api/bookmarks/user/[userId]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Bookmark from "@/app/lib/models/Bookmark";
import NGO from "@/app/lib/models/NGO";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ message: "UserId is required" }, { status: 400 });
    }

    // Find all bookmarks for the user
    const bookmarks = await Bookmark.find({ userId }).select("ngoId ngo").lean();

    // Extract ngoIds
    const ngoIds = bookmarks.map(b => b.ngoId);

    // Fetch NGOs that are bookmarked
    // const ngos = await NGO.find({ _id: { $in: ngoIds } }).lean();

    return NextResponse.json(ngoIds, { status: 200 });
  } catch (error) {
    console.error("Fetching bookmarked NGOs error:", error);
    return NextResponse.json({ message: "Failed to fetch bookmarks" }, { status: 500 });
  }
}
