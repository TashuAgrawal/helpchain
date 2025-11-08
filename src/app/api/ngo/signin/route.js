import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import NGO from "@/app/lib/models/NGO"; 
import { adminAuth } from "@/app/lib/firebaseAdmin";

/**
 * Handles POST requests for NGO login (Sign In).
 * Checks MongoDB credentials and issues a Firebase Custom Token.
 */
export async function POST(request) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    // Find the NGO by email in MongoDB, explicitly select password field
    const ngo = await NGO.findOne({ email }).select('+password');

    // Check if NGO exists and password is correct
    if (!ngo || !(await ngo.comparePassword(password))) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
    }

    // Check if NGO is approved before allowing login
    if (ngo.status !== 'approved') {
      return NextResponse.json({ message: `NGO registration is ${ngo.status}. Access denied.` }, { status: 403 });
    }

    // Generate Firebase Custom Token using MongoDB _id as UID
    const firebaseUid = ngo._id.toString();
    const customToken = await adminAuth.createCustomToken(firebaseUid, {
      role: 'ngo',
      mongoId: firebaseUid,
    });

    return NextResponse.json({ 
      message: "Login successful", 
      customToken: customToken 
    }, { status: 200 });

  } catch (error) {
    console.error("NGO Login Error:", error);
    return NextResponse.json({ message: "An unexpected error occurred during login." }, { status: 500 });
  }
}
