import OrderCard from "@/components/seller/OrderCard";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";

export default async function OrderPage() {
  const session = await getServerSession(authOptions);
  let orders: any[] = [];

  try {
    await connectToDatabase();
    if (!session?.user?.id) {
      return;
    }
    const ordersData = await Order.find({ sellerId: session?.user?.id })
      .sort({ createdAt: -1 })
      .lean();
    orders = JSON.parse(JSON.stringify(ordersData));
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }
  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <div className="bg-white rounded-lg border p-12 text-center">
          <p className="text-gray-600 text-lg">No orders yet</p>
          <p className="text-gray-500 mt-2">
            Your orders will appear here once somebody make a purchase
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}
