import { NextResponse } from "next/server";
// Use the alias to import your utilities (assuming @/ points to src/)
import { connectDB } from "@/lib/mongodb"; 
import User from "@/lib/models/User";

/**
 * GET handler to test MongoDB connection and User model.
 */
export async function GET() {
  try {
    // Connect to the database
    await connectDB();

    // Try to find all users (will create the collection if it doesn't exist)
    const users = await User.find({});

    // If successful, return the data
    return NextResponse.json({ 
        message: "MongoDB connection successful. Found users:", 
        users 
    }, { status: 200 });
    
  } catch (error) {
    // If connection or query fails
    console.error("API Test Error:", error);
    return NextResponse.json({ 
        message: "MongoDB connection or query failed.", 
        error: error.message 
    }, { status: 500 });
  }
}
