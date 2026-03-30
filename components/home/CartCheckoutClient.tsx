"use client";

import { placeCartOrder } from "@/app/actions/cartAction";
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

export default function CartCheckoutClient({
  cart,
  address,
  sellerUsernames,
}: {
  cart: Cart;
  address: any;
  sellerUsernames: Record<string, string>;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = 40;
  const discount = -40;
  const total = subtotal + deliveryFee + discount;
  const handlePlaceOrder = async () => {
    if (!address) {
      alert("Please add a delivery address");
      return;
    }
    setLoading(true);

    const result = await placeCartOrder({
      items: cart.items,
      address: {
        name: address.name,
        location: address.location,
        pin: address.pin,
        phone: address.phone,
      },
    });
    setLoading(false);
    if (result.success) {
      router.push("/profile");
    } else {
      alert(result.error || "Failed to place order");
    }
  };
  return (
    <div className="max-w-6xl mx-auto p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-2 space-y-5">
        <div className="p-5 border rounded bg-white">
          {address?.name && (
            <h2 className="font-semibold text-lg">
              Delivering to {address?.name}
            </h2>
          )}
          {address ? (
            <p className="text-gray-600 mt-1">
              {address?.location},{address?.pin}
              <br />
              Phone:{address?.phone}
            </p>
          ) : (
            <p className="text-gray-600 mt-1">No address found</p>
          )}
          <Link href="/address" className="text-blue-600 mt-2 inline-block">
            Change address
          </Link>
        </div>
        <div className="p-5 border rounded bg-white">
          <h2 className="font-semibold text-lg">Pay on delivery (Cash/Card)</h2>
          <button>Use a gift card, voucher or promo code</button>
        </div>
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.variantId}
              className="p-5 border rounded bg-white flex flex-col md:flex-row justify-between"
            >
              <div className="flex gap-4">
                <Image
                  src={item.image}
                  alt={item.itemName}
                  width={120}
                  height={120}
                  className="object-contain"
                />
                <div>
                  <h3 className="font-semibold text-md">{item.itemName}</h3>
                  <p className="text-gray-700">{item.price}</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Sold by {sellerUsernames[item.sellerId] || "Unknown Seller"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Object.entries(item.combination)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" / ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center mt-5 md:mt-0">
                <label className="flex items-center gap-2">
                  <input type="radio" checked readOnly />
                  <span>FREE Delivery</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-5 border rounded bg-white h-fit">
        <button
          onClick={handlePlaceOrder}
          disabled={loading || !address}
          className={`w-full py-3 rounded text-lg font-semibold ${
            loading || !address
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-500"
          }`}
        >
          {loading ? "Placing order" : "Place Order"}
        </button>
        {!address && (
          <p className="text-sm mt-2 text-red-600">
            Please add a delivery address to continue
          </p>
        )}
        <p className="text-sm mt-3 text-gray-600">
          By placing your order, you agree to our terms and conditions.
        </p>
        <hr className="my-4" />
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Items ({cart.items.length}):</span>
            <span>{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery:</span>
            <span>{deliveryFee}</span>
          </div>
          <div className="flex justify-between text-green-700 font-semibold">
            <span>FREE Delivery</span>
            <span>{discount}</span>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between text-lg font-bold">
          <span>Order Total:</span>
          <span>{total}</span>
        </div>
      </div>
    </div>
  );
}
