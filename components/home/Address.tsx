import { getAddress } from "@/app/actions/address";
import { MapPin } from "lucide-react";
import Link from "next/link";

export default async function Address() {
  const address = await getAddress();
  return (
    <Link href="/address">
      <div className="flex items-center bg-gray-200/40 rounded-xl px-3 py-1 space-x-2 hover:text-green-600 transition-colors duration-200 cursor-pointer">
        <MapPin className="w-5 h-5 transition-colors duration-200" />
        <div className="text-sm leading-tight">
          <p className="font-medium">Delivery to</p>
          {address?.pin ? (
            <p className="font-semibold">{address.pin}</p>
          ) : (
            <p className="font-semibold">700045</p>
          )}
        </div>
      </div>
    </Link>
  );
}
