import SellerMsg from "@/models/SellerMsg";
import { connectToDatabase } from "@/lib/db";
import { Loader2, Trash2, UserRoundCheck, UserRoundX } from "lucide-react";
import Link from "next/link";

export default async function SellersRequest() {
  await connectToDatabase();
  const messages = await SellerMsg.find().sort({ createdAt: -1 });
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Messages</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Seller Name</th>
              <th className="p-3 border">Messages</th>
              <th className="p-3 border text-center">Accept</th>
              <th className="p-3 border text-center">Reject</th>
              <th className="p-3 border text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {!messages ? (
              <tr>
                <td colSpan={4} className="text-center p-6">
                  <Loader2 className="w-6 h-6 mx-auto animate-spin text-blue-500" />
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={4} className="flex p-4 text-gray-500">
                  No messages found
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{msg.email}</td>
                  <td className="p-3 border">{msg.sellerName}</td>
                  <td className="p-3 border">{msg.message}</td>
                  <td className="p-3 border text-center">
                    <Link
                      href={{
                        pathname: `/admin/dashboard/accept/${msg._id}`,
                        query: { seller: msg.sellerName },
                      }}
                      className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition inline-flex items-center justify-center"
                    >
                      <UserRoundCheck className="text-green-600 w-5 h-5" />
                    </Link>
                  </td>
                  <td className="p-3 border text-center">
                    <Link
                      href={{
                        pathname: `/admin/dashboard/reject/${msg._id}`,
                        query: { seller: msg.sellerName },
                      }}
                      className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition inline-flex items-center justify-center"
                    >
                      <UserRoundX className="text-red-600 w-5 h-5" />
                    </Link>
                  </td>
                  <td className="p-3 border text-center">
                    <Link
                      href={{
                        pathname: `/admin/dashboard/delete/${msg._id}`,
                        query: { seller: msg.sellerName },
                      }}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition inline-flex items-center justify-center"
                    >
                      <Trash2 className="text-gray-600 w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
