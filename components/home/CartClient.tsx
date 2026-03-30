"use client";

import {
  removeFromCart,
  updateCartItemQuantity,
} from "@/app/actions/cartAction";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  combination: Record<string, string>;
  itemName: string;
  image: string;
  sellerId: string;
  deliveryInDays: number;
  stock: number;
}
interface Cart {
  items: CartItem[];
}

export default function CartClient({ cart }: { cart: Cart }) {
  const [items, setItems] = useState<CartItem[]>(cart.items || []);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">
          Add items to your cart to see them here
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }
  const handleQuantityChange = async (
    variantId: string,
    newQuantity: number,
  ) => {
    const item = items.find((i) => i.variantId === variantId);
    if (!item) return;

    if (newQuantity > item.stock) {
      alert(`only ${item.stock} items available in stock`);
      return;
    }
    if (newQuantity < 1) return;
    setLoading(variantId);
    const result = await updateCartItemQuantity(variantId, newQuantity);

    if (result.success) {
      setItems((prev) =>
        prev.map((i) =>
          i.variantId === variantId ? { ...i, quantity: newQuantity } : i,
        ),
      );
    } else {
      alert(result.error || "Failed to update quantity");
    }
    setLoading(null);
  };
  const handleRemove = async (variantId: string) => {
    if (!confirm("Remove this item from cart?")) return;

    setLoading(variantId);
    const result = await removeFromCart(variantId);

    if (result.success) {
      setItems((prev) => prev.filter((i) => i.variantId !== variantId));
    } else {
      alert(result.error || "Failed to remove item");
    }
    setLoading(null);
  };
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = items.length > 0 ? 40 : 0;
  const discount = items.length > 0 ? -40 : 0;
  const total = subtotal + deliveryFee + discount;
  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }
    router.push("/cart/checkout");
  };
  return (
    <div className="max-w-6xl mx-auto p-5">
      <h1 className="text-3xl font-semibold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="p-5 border rounded bg-white flex gap-4"
            >
              <Image
                src={item.image}
                alt={item.itemName}
                width={120}
                height={120}
                className="object-contain"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.itemName}</h3>
                <p>
                  {Object.entries(item.combination)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(" / ")}
                </p>
                <p className="text-lg font-bold text-gray-800 mt-2">
                  ₹{item.price}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {item.stock > 0 ? (
                    <span className="text-gray-700">In Stock</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.variantId, item.quantity - 1)
                    }
                    disabled={loading === item.variantId || item.quantity <= 1}
                    className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.variantId, item.quantity + 1)
                    }
                    disabled={
                      loading === item.variantId || item.quantity >= item.stock
                    }
                    className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-600 ml-2">
                    {item.stock} available
                  </span>
                </div>
                <button
                  onClick={() => handleRemove(item.variantId)}
                  disabled={loading === item.variantId}
                  className="text-red-600 text-sm mt-3 hover:underline disabled:opacity-50"
                >
                  {loading === item.variantId ? "Removing..." : "Remove"}
                </button>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1 ">
          <div className="p-5 border rounded bg-white sticky top-5">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Order Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-center">
                <span>Subtotal ({items.length} items):</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-center">
                <span>Delivery:</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-center text-green-700 font-semibold">
                <span>FREE Delivery:</span>
                <span>₹{discount}</span>
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex justify-center text-green-700 font-semibold">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-yellow-400 py-3 rounded font-semibold hover:bg-yellow-500"
            >
              Proceed to Checkout
            </button>
            <Link
              href="/"
              className="block text-center text-blue-600 mt-4 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
