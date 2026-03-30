import OrderCard from "@/components/home/OrderCard";
import Logout from "@/components/Logout";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }
  let orders: any[] = [];
  try {
    await connectToDatabase();
    orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    orders = JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }
  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <div className="bg-white rounded-lg border p-12">
          <p className="text-gray-600 text-lg">No orders yet</p>
          <p className="text-gray-500 mt-2">
            Your orders will appear here once you make a purchase
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <div className="flex items-center space-x-3">
          <Image
            src={"/images/user.png"}
            alt="user pic"
            width={30}
            height={30}
            className="object-contain"
          />
          <h1 className="text-base font-semibold text-black bg-gray-200 px-2 py-0.5 rounded-md">
            {session.user.email}
          </h1>
          <Logout path="/" />
        </div>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}
