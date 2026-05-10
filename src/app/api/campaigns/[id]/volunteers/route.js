import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import CampaignVolunteer from "@/app/lib/models/CampaignVolunteer";
import User from "@/app/lib/models/User";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Campaign ID is required" }, { status: 400 });
    }

    // Find all accepted volunteers for this campaign
    const volunteerRecords = await CampaignVolunteer.find({
      campaignId: id,
      requestStatus: "accepted",
    });

    // Populate user details manually since volunteerId is a string mapping to User's _id
    const volunteersWithDetails = await Promise.all(
      volunteerRecords.map(async (record) => {
        try {
          const user = await User.findById(record.volunteerId).select("username email");
          return {
            _id: record._id,
            volunteerId: record.volunteerId,
            attended: record.attended,
            name: user?.username || "Unknown Volunteer",
            email: user?.email || "No email",
          };
        } catch (err) {
           return {
            _id: record._id,
            volunteerId: record.volunteerId,
            attended: record.attended,
            name: "Unknown Volunteer",
            email: "No email",
          };
        }
      })
    );

    return NextResponse.json({ volunteers: volunteersWithDetails }, { status: 200 });
  } catch (error) {
    console.error("Get Campaign Volunteers Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
