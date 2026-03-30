"use client";

import axios from "axios";
import { Calendar, Clock, MapPin, Package, Phone } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface OrderItem {
  productId: string;
  variantId: string;
  ItemName: string;
  image: string;
  deliveryInDays: number;
  quantity: number;
  price: number;
  combination: Record<string, string>;
  _id: string;
}
interface OrderAddress {
  name: string;
  location: string;
  pin: string;
  phone: string;
  _id: string;
}
interface Order {
  _id: string;
  userId: string;
  sellerId: string;
  items: OrderItem[];
  address: OrderAddress[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
interface OrderCardProps {
  order: Order;
}
export default function OrderCard({ order }: OrderCardProps) {
  const [status, setStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    shipped: "bg-purple-100 text-purple-800 border-purple-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    canceled: "bg-red-100 text-white border-red-200",
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;
    setIsUpdating(true);
    try {
      const response = await axios.patch(
        `/api/orders/${order._id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.data.success) {
        setStatus(newStatus);
      }
    } catch (error: any) {
      console.error("Error updating order status", error);
      const errorMessage =
        error.response?.data?.error ||
        "Failed to update status. Please try again.";
      alert(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order._id.slice(-8).toUpperCase()}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  statusColors[status as keyof typeof statusColors] ||
                  statusColors.pending
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>{order.items.length} item(s)</span>
              </div>
            </div>
          </div>
          {order.address.length > 0 && (
            <div className="border-b border-gray-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Delivery Address
              </h4>
              <div className="flex flex-row items-center gap-2 text-sm">
                <p className="font-medium text-gray-900">
                  {order.address[0].name}
                </p>
                <p className="text-gray-600">{order.address[0].location}</p>
                <p className="text-gray-600">PIN: {order.address[0].pin}</p>
                <Phone className="w-3.5 h-3.5" />
                <span>{order.address[0].phone}</span>
              </div>
            </div>
          )}
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ₹{order.totalAmount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">Total Amount</div>
          </div>
        </div>
        <div className="border-t border-gray-100">
          {order.items.map((item) => (
            <div
              key={item._id}
              className="p-6 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex gap-4">
                <Image
                  height={100}
                  width={100}
                  src={item.image || "/images/placeholder.png"}
                  alt={item.ItemName}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 mb-1">
                    {item.ItemName}
                  </h5>
                  {Object.keys(item.combination).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {Object.entries(item.combination).map(([key, value]) => (
                        <span
                          key={key}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {key}:{value}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Qty: {item.quantity}</span>
                    <span> ₹{item.price.toLocaleString()} each</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.deliveryInDays} days delivery</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-gray-900">
                    Subtotal: ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Order Status
          </label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={status === "canceled"}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          {isUpdating && (
            <span className="ml-2 text-sm text-gray-600">Updating...</span>
          )}
        </div>
      </div>
    </div>
  );
}
