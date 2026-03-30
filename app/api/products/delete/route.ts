import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import Product from "@/models/Product";
import { connectToDatabase } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    const body = await req.json();
    const { productId } = body;

    if (!productId)
      return NextResponse.json(
        { message: "Missing productId" },
        { status: 400 },
      );

    const sellerId = String(session.user.id);
    const product = await Product.findOne({ _id: productId, sellerId });
    if (!product)
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    await Product.deleteOne({ _id: productId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
