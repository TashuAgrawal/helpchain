import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import NGOMember from "@/app/lib/models/NGOMember";
import User from "@/app/lib/models/User";
import mongoose from "mongoose";

/**
 * POST /api/ngo/[ngoId]/members
 */
export async function POST(request) {
    try {
        await connectDB();

        const { usermail, ngoId, role } = await request.json();

        // 1. Validation
        if (!usermail || !ngoId || !role) {
            return NextResponse.json(
                { message: "Missing email, NGO ID, or role." },
                { status: 400 }
            );
        }

        // 2. Find the user by email
        // Corrected: Use .findOne() and wrap query in an object
        const user = await User.findOne({ email: usermail });

        if (!user) {
            return NextResponse.json(
                { message: "User with this email not found." },
                { status: 404 }
            );
        }

        const userId = user._id; // Mongoose uses _id by default

        // Convert to ObjectId to ensure valid MongoDB format
        const ngoObjectId = new mongoose.Types.ObjectId(ngoId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // 3. Check if membership already exists
        const existingMember = await NGOMember.findOne({
            ngoId: ngoObjectId,
            userId: userObjectId,
        });

        if (existingMember) {
            return NextResponse.json(
                { message: "User is already a member of this NGO." },
                { status: 409 }
            );
        }

        // 4. Create the new membership
        const newMember = await NGOMember.create({
            ngoId: ngoObjectId,
            userId: userObjectId,
            role: role
        });

        
        return NextResponse.json(
            {
                message: "Member added successfully.",
                member: {
                    id: newMember._id,
                    ngoId: newMember.ngoId,
                    userId: newMember.userId,
                    role: newMember.role,
                    joinedAt: newMember.createdAt,
                },
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Add NGO Member Error:", error);

        if (error.name === 'BSONError' || error.name === 'CastError') {
            return NextResponse.json(
                { message: "Invalid ID format provided." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Failed to add member.", error: error.message },
            { status: 500 }
        );
    }
}