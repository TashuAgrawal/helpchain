// src/app/api/admin/users/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/lib/models/User";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({ role: 'user' }).select("-password");

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Fetching users error:", error);
    return NextResponse.json({ message: "Failed to fetch users." }, { status: 500 });
  }
}
