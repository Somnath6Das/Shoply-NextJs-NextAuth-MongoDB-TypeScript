import SellerForms from "@/components/seller/SellerForms";
import Image from "next/image";
import Link from "next/link";

export default async function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="w-full bg-white shadow-sm px-6 py-3 flex items-center">
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition"
        >
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="object-contain"
          />
        </Link>
      </nav>
      <SellerForms />
    </div>
  );
}
