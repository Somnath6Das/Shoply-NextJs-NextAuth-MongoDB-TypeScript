"use client";

import { placeOrder } from "@/app/actions/placeOrder";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutClient({
  item,
  address,
  sellerUsername,
}: {
  item: any;
  address: any;
  sellerUsername: string | undefined;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const qty = item.qty;
  const price = item.price * qty;
  const deliveryFee = 40;

  const discount = -40;
  const total = price + deliveryFee + discount;
  const handlePlaceOrder = async () => {
    setLoading(true);
    if (!address) {
      router.push("/address");
    }
    if (address) {
      const res = await placeOrder({
        productId: item.productId,
        variantId: item.variantId,
        sellerId: item.sellerId,
        deliveryInDays: item.deliveryInDays,
        qty: item.qty,
        price: item.price,
        combination: item.combination,
        itemName: item.name,
        image: item.images[0],
        address: {
          name: address.name,
          location: address.location,
          pin: address.pin,
          phone: address.phone,
        },
      });

      setLoading(false);
      if (res?.success) {
        router.push("/profile");
      } else {
        alert(res.error || "Something went wrong");
      }
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
              {address?.location}, {address?.pin}
              <br />
              Phone: {address?.phone}
            </p>
          ) : (
            <p className="text-gray-600 mt-1">No address found</p>
          )}
          <Link href="/address" className="text-blue-600 mt-2">
            Change Address
          </Link>
        </div>
        <div className="p-5 border rounded bg-white">
          <h2 className="font-semibold text-lg">Pay on delivery (Cash/Card)</h2>
          <button className="text-blue-600 mt-2">
            Use a gift card, voucher or promo code
          </button>
        </div>
        <div className="p-5 border rounded bg-white flex flex-col md:flex-row justify-between">
          <div className="flex gap-4">
            <Image
              src={item.images[0]}
              alt="product"
              width={120}
              height={120}
              className="object-contain"
            />
            <div>
              <h3 className="font-semibold text-md">{item.name}</h3>
              <p className="text-gray-700">₹{item.price}</p>
              <p className="text-gray-600 text-sm mt-1">Qty: {qty}</p>
              <p className="text-gray-600 text-sm mt-1">
                Sold by {sellerUsername}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {Object.entries(item.combination)
                  .map(([k, v]) => `${k}:${v}`)
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
      </div>
      <div className="p-5 border rounded bg-white h-fit">
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-yellow-400 py-3 rounded text-lg font-semibold"
        >
          {loading ? "Placeing order" : "Place Order"}
        </button>
        <p className="text-sm mt-3 text-gray-600">
          By placeing your order, you agree to our terms and conditions
        </p>
        <hr className="my-4" />
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Items:</span>
            <span>₹{price}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery:</span>
            <span>₹{deliveryFee}</span>
          </div>
          <div className="flex justify-between text-green-700 font-semibold">
            <span>FREE Delivery</span>
            <span>₹{discount}</span>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between text-lg font-bold">
          <span>Order Total:</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
}
