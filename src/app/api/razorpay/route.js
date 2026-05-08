import { NextResponse } from "next/server";
const Razorpay = require("razorpay");
const shortid = require("shortid");

// Initialize razorpay object
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_KEY,
});

export async function POST(request) {
    try {
        const { amount } = await request.json();
        const amountInPaisa = amount * 100; // amount in paisa. In our case it's INR 1
        const currency = "INR";
        const options = {
            amount: amountInPaisa.toString(),
            currency,
            receipt: shortid.generate(),
        };
        const response = await razorpay.orders.create(options);
        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}