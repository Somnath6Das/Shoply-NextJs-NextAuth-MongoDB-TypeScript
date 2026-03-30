import Leftbar from "@/components/Leftbar";
import Logout from "@/components/Logout";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const username = session?.user?.username;
  const menuItems = [
    {
      name: "Sellers Request",
      icon: "MessageSquarePlus",
      path: "/admin/dashboard",
    },
    {
      name: "Sellers Account",
      icon: "UsersRound",
      path: "/admin/dashboard/sellers-account",
    },
  ];
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <header className="flex-none flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <h1 className="text-lg font-semibold text-green-600 tracking-wide">
            Admin
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Image
            src={"/images/user.png"}
            alt="user"
            width={30}
            height={30}
            className="object-contain"
          />
          <h1
            className="text-base font-semibold text-green-600 bg-gray-200 px-1
          py-0.5 rounded-md"
          >
            {username}
          </h1>
          <Logout path={"/admin"} />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="h-full flex-none">
          <Leftbar menuItems={menuItems} />
        </div>
        <main className="flex-1 h-full overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
