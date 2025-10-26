// /app/api/profile/route.js

import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb'; // Assuming this exports connectDB directly
import { adminAuth } from '@/app/lib/firebaseAdmin'; // Assuming this exports adminAuth
import User from '@/app/lib/models/User';

// Helper function to handle GET requests
export async function GET(request) {
    try {
        // Ensure necessary dependencies are available
        if (!adminAuth) {
            console.error("Firebase Admin Auth not initialized.");
            return NextResponse.json({ message: "Service dependency error." }, { status: 500 });
        }
        await connectDB();
        console.log("BYE");
        
        // 1. Get the Firebase ID Token from the client request headers
        const authHeader = request.headers.get('Authorization');
console.log("hello");
        
        const token = authHeader?.split('Bearer ')[1];
// console.log(token);

        if (!token) {
            return NextResponse.json({ message: "No authentication token provided." }, { status: 401 });
        }

        let decodedToken;
        try {
            // 2. Verify the ID Token using Firebase Admin
            // This is the correct method call on the imported adminAuth object.
            decodedToken = await adminAuth.verifyIdToken(token); 

            console.log(decodedToken);
        } catch (authError) {
            console.error("Token verification failed:", authError.message);
            // Handle specific Firebase Admin errors gracefully
            return NextResponse.json({ message: "Invalid or expired token." }, { status: 401 });
        }

        // 3. Extract the email from the decoded token
        const user_id = decodedToken.user_id;
        const firebaseUid = decodedToken.uid;

        // 4. Find the user profile in MongoDB (excluding the password hash)
        // Finding by email is robust as it's a field present in both Firebase and MongoDB.
        const userProfile = await User.findOne({ _id: user_id }).select('-password -__v'); 
        console.log(userProfile);
        
        if (!userProfile) {
            // Note: If the user exists in Firebase but not MongoDB, return 404
            return NextResponse.json({ message: "User profile not found in database." }, { status: 404 });
        }

        console.log({
                email: userProfile.email,
                username: userProfile.username,
                role: userProfile.role, // Assuming 'role' is a field you want to return
                mongoId: userProfile._id.toString(), // The MongoDB ID
                uid: firebaseUid, // The Firebase UID
            } );
        

        // 5. Return the non-sensitive profile data
        return NextResponse.json({ 
            user: {
                email: userProfile.email,
                username: userProfile.username,
                role: userProfile.role, // Assuming 'role' is a field you want to return
                mongoId: userProfile._id.toString(), // The MongoDB ID
                uid: firebaseUid, // The Firebase UID
            } 
        }, { status: 200 });

    } catch (error) {
        console.error("FATAL Server Error in /api/profile:", error);
        return NextResponse.json({ message: "Internal server error occurred." }, { status: 500 });
    }
}