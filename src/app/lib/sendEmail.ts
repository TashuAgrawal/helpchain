import nodemailer from "nodemailer";

export default async function sendOtpEmail(receiverEmail: string, code: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    console.log({
      user: process.env.EMAIL_FROM,
    });
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: receiverEmail,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Your OTP Code</h2>
          <p>Use the code below to verify your account:</p>
          <h1 style="letter-spacing: 4px;">${code}</h1>
          <p>This code will expire soon.</p>
        </div>
      `,
    };
    console.log("Code", code);

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "OTP email sent successfully",
    };
  } catch (error) {
    console.error("Email Send Error:", error);

    return {
      success: false,
      message: "Failed to send OTP email",
    };
  }
}