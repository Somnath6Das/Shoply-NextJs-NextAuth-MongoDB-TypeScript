import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import SellerMsg from "@/models/SellerMsg";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, sellerName, message } = await req.json();
    if (!email || !sellerName || !message) {
      return NextResponse.json(
        { error: "Email, seller name, and message are requied" },
        { status: 400 }
      );
    }
    const normalizedEmail = email.toLowerCase();
    const existingMsg = await SellerMsg.findOne({ email: normalizedEmail });
    if (existingMsg) {
      return NextResponse.json(
        { error: "Message already sent" },
        { status: 400 }
      );
    }
    const existingUser = await User.findOne({
      email: normalizedEmail,
      role: "seller",
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "You are aleady a seller" },
        { status: 400 }
      );
    }
    const sellerMsg = new SellerMsg({
      email: normalizedEmail,
      sellerName,
      message,
    });
    await sellerMsg.save();

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seller message error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
