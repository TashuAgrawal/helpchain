// src/app/api/solutions/[problemId]/route.js
import { NextResponse } from "next/server"
import Solution from "@/app/lib/models/Solution";
import { connectDB } from "@/app/lib/mongodb";
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { problemId } = params;
    
    const solutions = await Solution.find({ problemId })
    return NextResponse.json(solutions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
