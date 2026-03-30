import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LoginButton from "./LoginButton";
import Address from "./Address";
import SearchInput from "./SearchInput";

type SimpleCategory = {
  _id: string;
  main: string;
  subs: string[];
};

export default async function Navbar() {
  await connectToDatabase();
  const categories = await Category.find().sort({ main: 1 }).lean();

  const simple: SimpleCategory[] = categories.map((cat) => ({
    _id: cat._id.toString(),
    main: cat.main,
    subs: cat.subs || [],
  }));
  return (
    <nav className="sticky top-0 z-50 flex flex-wrap gap-4 items-center justify-between bg-white/30 rounded-2xl p-2 pr-4 drop-shadow-[0_4px_8px_rgba] backdrop-blur-md">
      <div className="flex items-center rounded-xl px-3 py-1">
        <Link href="/" className="flex items-center space-x-1">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded"
            priority
          />
          <h2 className="text-gray-600 font-semibold text-xl">Shoply</h2>
        </Link>
      </div>
      <Address />
      <SearchInput categories={simple} />
      <div className="flex items-center bg-gray-200/40 rounded-xl px-3 py-1 space-x-2 hover:text-green-600 transition-colors duration-200 cursor-pointer">
        <Heart className="w-5 h-5" />
        <span className="text-sm font-medium">Wish List</span>
      </div>
      <LoginButton />
      <Link
        href="/cart"
        className=" flex items-center bg-gray-200/40 rounded-xl px-3 py-1 space-x-2 hover:text-green-600 transition-colors duration-200 cursor-pointer"
      >
        <ShoppingCart className="w-5 h-5 transition-colors duration-200" />
        <span className="text-sm font-medium">Cart</span>
      </Link>
    </nav>
  );
}
