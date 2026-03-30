"use client";

import { CircleUserRound, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function LoginButton() {
  const { data: session, status } = useSession();
  if (status === "loading") return <p>Loading...</p>;
  console.log(JSON.stringify(session, null, 2));

  return (
    <div>
      {session?.user.role === "user" ? (
        <Link
          href="/profile"
          className="flex items-center bg-gray-200/40 rounded-xl px-3 py-1 space-x-2 hover:text-green-600 transition"
        >
          <CircleUserRound size={20} />
          <span className="text-sm font-medium">Profile</span>
        </Link>
      ) : (
        <Link
          href="/login"
          className="flex items-center bg-gray-200/40 rounded-xl px-3 py-1 space-x-2 hover:text-green-600 transition"
        >
          <LogIn className="w-5 h-5" />
          <span className="text-sm font-medium">Login</span>
        </Link>
      )}
    </div>
  );
}
