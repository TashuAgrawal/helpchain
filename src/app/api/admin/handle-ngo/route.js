import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import NGO from "@/app/lib/models/NGO";

/**
 * POST /api/admin/handle-ngo
 * Request body: { ngoId: string, action: 'approve' | 'reject' }
 * Approves or rejects a pending NGO by updating its status.
 */
export async function POST(request) {
  try {
    await connectDB();

   

    console.log(456)
    const { ngoId, action } = await request.json();
     console.log(ngoId , action);

    if (!ngoId) {
      return NextResponse.json({ message: "ngoId is required." }, { status: 400 });
    }

    if (!action || !['approve', 'reject','suspend'].includes(action)) {
      return NextResponse.json({ message: "Valid action ('approve' or 'reject' or'suspend' ) is required." }, { status: 400 });
    }

    // Find the NGO user by ID and role = 'ngo'
    const ngo = await NGO.findOne({ _id: ngoId });
    console.log(ngo);
    if (!ngo) {
      return NextResponse.json({ message: "NGO not found." }, { status: 404 });
    }

    ngo.status = action === 'approve' ? 'approved' : (action === 'suspend' ? 'suspend' : ('rejected'));
    await ngo.save();

    return NextResponse.json({ message: `NGO ${ngo.status} successfully.` }, { status: 200 });

  } catch (error) {
    console.error("Handle NGO Error:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
