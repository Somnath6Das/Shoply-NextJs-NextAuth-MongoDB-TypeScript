import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({
        success: false,
        error: "Email is required",
      });
    }

    const seller = await User.findOne({ email, role: "seller" });
    if (!seller) {
      return NextResponse.json({
        success: false,
        error: "Seller not found with this email",
      });
    }
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/seller/set-password?id=${seller._id}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: `"Shoply Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `<div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f8f9fb; border-radius: 10px;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 24px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="text-align: center; color: #333;">Reset Your Password</h2>
            <p style="font-size: 15px; color: #555; text-align: center;">
              We received a request to reset your password. Click the button below to create a new one.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}"
                 style="display: inline-block; background-color: #5e3e89; color: white; 
                        text-decoration: none; padding: 12px 28px; border-radius: 6px; 
                        font-weight: 600; font-size: 15px;">
                Reset Password
              </a>
            </div>

            <p style="font-size: 13px; color: #777; text-align: center;">
              If you didn’t request this, please ignore this email. The link will expire soon.
            </p>

            <hr style="margin-top: 24px; border: none; border-top: 1px solid #eee;">
            <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 12px;">
              &copy; ${new Date().getFullYear()} Shoply. All rights reserved.
            </p>
          </div>
        </div>`,
    };
    await transporter.sendMail(mailOptions);
    return NextResponse.json({
      success: true,
      message: "Password reset link sent successfully",
    });
  } catch (error) {
    console.error("Forget Password Error:", error);
    return NextResponse.json({
      success: false,
      error: "Something went wrong. Try again later.",
    });
  }
}
