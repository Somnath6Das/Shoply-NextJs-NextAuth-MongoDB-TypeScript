import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { status } = await request.json();
    const validStatuses = ["pending", "shipped", "delivered", "canceled"];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    await connectToDatabase();
    const { orderId } = await params;

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isBuyer = order.userId.toString() === session.user.id;
    const isSeller = order.sellerId.toString() === session.user.id;

    if (!isBuyer && !isSeller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    if (isSeller && !["pending", "shipped", "delivered"].includes(status)) {
      return NextResponse.json(
        {
          error: "Seller can only update to shipped or deliverd",
        },
        { status: 403 },
      );
    }
    order.status = status;
    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order status successfully",
      status: order.status,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },

      { status: 500 },
    );
  }
}
