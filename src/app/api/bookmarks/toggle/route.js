// src/app/api/bookmarks/toggle/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Bookmark from "@/app/lib/models/Bookmark";

export async function POST(request) {
  try {
    await connectDB();

    const { userId, ngoId } = await request.json();

    if (!userId || !ngoId) {
      return NextResponse.json({ message: "userId and ngoId are required." }, { status: 400 });
    }

    // Check if bookmark exists
    const existingBookmark = await Bookmark.findOne({ userId, ngoId });

    if (existingBookmark) {
      // Remove bookmark
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      return NextResponse.json({ message: "Bookmark removed", bookmarked: false }, { status: 200 });
    } else {
      // Create bookmark
      const newBookmark = new Bookmark({ userId, ngoId });
      await newBookmark.save();
      return NextResponse.json({ message: "Bookmark added", bookmarked: true }, { status: 201 });
    }
  } catch (error) {
    console.error("Toggle bookmark error:", error);
    return NextResponse.json({ message: "Failed to toggle bookmark" }, { status: 500 });
  }
}
