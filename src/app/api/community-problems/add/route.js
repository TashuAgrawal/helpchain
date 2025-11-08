// src/app/api/community-problems/add/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import CommunityProblem from "@/app/lib/models/CommunityProblem";

/**
 * POST /api/community-problems/add
 * Adds a new community problem.
 * Expects JSON body with title, description, category, postedBy, date, location.
 */
export async function POST(request) {
  try {
    await connectDB();

    const { title, description, category, postedBy, date, location } = await request.json();

    if (!title || !description || !category || !postedBy || !date || !location) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    const newProblem = new CommunityProblem({
      title,
      description,
      category,
      postedBy,
      date: new Date(date),
      location,
      responses: 0,
      upvotes: 0,
      userVoted: false,
    });

    await newProblem.save();

    return NextResponse.json({ message: "Community problem posted successfully.", problem: newProblem }, { status: 201 });

  } catch (error) {
    console.error("Error posting community problem:", error);
    return NextResponse.json({ message: "Failed to post community problem." }, { status: 500 });
  }
}
