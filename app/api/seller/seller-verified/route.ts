import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id, password } = await req.json();
    if (!id || typeof password !== "string" || password.trim() === "") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 },
      );
    }
    const seller = await User.findById(id);
    if (!seller) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      { _id: id },
      { $set: { password: hashedPassword, verified: true } },
    );
    return NextResponse.json({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {
    console.log("Set Password Error:", error);
    return NextResponse.json(
      { error: "Something went wrong!2" },
      { status: 500 },
    );
  }
}
