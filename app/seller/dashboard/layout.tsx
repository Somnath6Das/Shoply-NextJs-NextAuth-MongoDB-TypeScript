import Leftbar from "@/components/Leftbar";
import Logout from "@/components/Logout";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const menuItems = [
    { name: "Orders", icon: "ShoppingCart", path: "/seller/dashboard" },
    { name: "Products", icon: "Package", path: "/seller/dashboard/products" },
    {
      name: "Categories",
      icon: "Grid2x2PlusIcon",
      path: "/seller/dashboard/categories",
    },
  ];
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <header className="flex-none flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <h1 className="text-lg font-semibold text-green-600 tracking-wide">
            Seller
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <Image
            src={"/images/user.png"}
            alt="user"
            width={30}
            height={30}
            className="object-contain"
          />
          <h1 className="text-base font-semibold text-black bg-gray-200 px-2 py-0.5 rounded-md">
            {email}
          </h1>
          <Logout path={"/seller"} />
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
