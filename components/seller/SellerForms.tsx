"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SellerLogin from "./SellerLogin";
import SellerMsgForm from "./SellerMsgForm";

export default function SellerForms() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col md:flex-row flex-1 items-center justify-center px-4 py-8 gap-8">
      <div className="flex justify-center">
        <Image
          src={
            pathname === "/seller" ? "/images/login.png" : "/images/seller.png"
          }
          alt="Auth Image"
          width={300}
          height={300}
          className="object-contain rounded-xl shadow w-25 h-25 sm:h-37.5 md:w-75 md:h-75 transition-all duration-300"
        />
      </div>
      <div className="w-full md:w-105 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b w-full">
          <Link
            href="/seller"
            className={`flex-1 py-3 text-base sm:text-lg font-medium transition-colors duration-200 ${
              pathname === "/seller"
                ? "bg-gray-100 text-[#5e3e89]"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <div className="flex justify-center">Login</div>
          </Link>
          <Link
            href="/seller/seller-message"
            className={`flex-1 py-3 text-base sm:text-lg font-medium transition-colors duration-200 ${
              pathname === "/seller/seller-message"
                ? "bg-gray-100 text-[#5cca01]"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <div className="flex justify-center">Become a seller</div>
          </Link>
        </div>
        <div className="p-4 sm:p-6 md:p-8 w-full">
          {pathname === "/seller" ? <SellerLogin /> : <SellerMsgForm />}
        </div>
      </div>
    </div>
  );
}
