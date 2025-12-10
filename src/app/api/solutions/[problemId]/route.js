// src/app/api/solutions/[problemId]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; 
import Solution from "@/lib/models/Solution";
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
