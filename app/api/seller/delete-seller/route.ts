import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Missing id or reason" },
        { status: 400 },
      );
    }
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }
    const seller = await User.findById(id);
    if (!seller) {
      return NextResponse.json(
        { error: "Seller Account not found" },
        { status: 404 },
      );
    }
    await User.findByIdAndDelete(id);
    return NextResponse.json(
      { error: "Seller Account deleted Successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete seller account Error", error);
    return NextResponse.json(
      { error: "Something went wrong while deleting seller Account" },
      { status: 500 },
    );
  }
}
