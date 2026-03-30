"use client";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function LoginView({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white/30 backdrop-blur-xl shadow-xl rounded-2xl w-87.5 p-6 border border-white/40 text-center"
      >
        <Link
          href="/"
          className="absolute top-3 right-3 text-gray-700 hover:text-red-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </Link>

        <div className="flex justify-center mb-4 space-x-4">
          <Link
            href="/login"
            className={`pb-1 text-lg font-semibold ${
              pathname === "/login"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-white"
            }`}
          >
            Login
          </Link>
          <Link
            href="/register"
            className={`pb-1 text-lg font-semibold ${
              pathname === "/register"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-white"
            }`}
          >
            Signup
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
