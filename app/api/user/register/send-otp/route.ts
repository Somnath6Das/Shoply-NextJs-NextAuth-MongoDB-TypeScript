import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 },
      );
    }
    const otp = crypto.randomInt(1000, 9999).toString();

    console.log(otp);
    global.otpStore = global.otpStore || {};
    global.otpStore[email] = otp;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: `"Signup System" < ${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
      <div style="font-family: Arial; background: #f9f9f9; padding: 20px;">
          <h2 style="color: #16a34a;">Verify your Email</h2>
          <p>Here is your OTP code:</p>
          <h1 style="font-size: 32px; letter-spacing: 4px; color: #333;">${otp}</h1>
          <p style="color:#666;">Please do not share this OTP with anyone.</p>
        </div>`,
    });
    return NextResponse.json(
      {
        success: true,
        message: "OTP send successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      {
        error: "Failed to send OTP",
      },
      { status: 500 },
    );
  }
}
