"use server";
import ProductListButtons from "@/components/seller/product/ProductListButtons";
import ProductListPagination from "@/components/seller/product/ProductListPagination";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { PackagePlus } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

type Props = {
  searchParams?: { page?: string };
};
export default async function ProductListPage({ searchParams }: Props) {
  const PAGE_SIZE = 10;
  const resolvedSearchParams = await searchParams;
  const page = Math.max(1, parseInt(resolvedSearchParams?.page || "1", 10));

  const session = await getServerSession(authOptions);
  if (!session) return (<div>Unauthorized</div>) as any;
  await connectToDatabase();
  const sellerId = String(session.user.id);
  const filter = { sellerId };
  const totalCount = await Product.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .lean();
  return (
    <div className="p-4">
      <div className="mb-4">
        <Link
          href="/seller/dashboard/products/create"
          className="flex justify-center w-48 bg-[#06991c] text-white px-4 py-2 rounded-lg hover:bg-[#1d571e] transition-all duration-200 gap-3"
        >
          <PackagePlus /> Create Product
        </Link>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">My Products</h2>
        <div className="text-sm text-gray-600">{`${totalCount} total`}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-center border w-[30%]">Name</th>
              <th className="p-2 text-center border w-[10%]">Category</th>
              <th className="p-2 text-center border w-[30%]">Variants</th>
              <th className="p-2 text-center border w-[15%]">Created</th>
              <th className="p-2 text-center border w-[15%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => {
              const variants = p.variants || [];
              const variantsImages = variants.map(
                (v: any) => v.images?.[0] || "",
              );
              const allSameImage =
                variantsImages.length > 0 &&
                variantsImages.every(
                  (img: string) => img === variantsImages[0],
                );
              return (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-2 align-top border">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-gray-600">{p.description}</div>
                  </td>
                  <td className="p-2 align-top border">
                    {p.category?.main}
                    {p.category?.sub ? ` / ${p.category.sub}` : ""}
                  </td>
                  <td className="p-2 align-top text-sm border">
                    {variants.length > 0 ? (
                      allSameImage ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 border rounded overflow-hidden shrink-0">
                              <Image
                                height={60}
                                width={60}
                                src={
                                  variantsImages[0] || "/images/placeholder.png"
                                }
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col text-sm">
                              {variants.map((v: any, i: number) => (
                                <div key={i} className="mb-1">
                                  <div className="font-medium">
                                    {v.combination &&
                                    Object.keys(v.combination).length > 0
                                      ? Object.entries(v.combination)
                                          .map(([k, v]) => `${k}: ${v}`)
                                          .join(", ")
                                      : "Default"}
                                  </div>
                                  <div className="text-gray-800">
                                    Price: {v.price || "-"} | Stock:{" "}
                                    {v.stock || "-"}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {variants.map((v: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-2"
                            >
                              <div className="w-16 h-16 border rounded overflow-hidden shrink-0">
                                <Image
                                  height={60}
                                  width={60}
                                  src={
                                    v.images?.[0] || "/images/placeholder.png"
                                  }
                                  alt={`${p.name}-variant-${i}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col text-sm">
                                <div className="font-medium">
                                  {v.combination &&
                                  Object.keys(v.combination).length > 0
                                    ? Object.entries(v.combination)
                                        .map(([k, val]) => `${k}: ${val}`)
                                        .join(", ")
                                    : "Default"}
                                </div>
                                <div className="text-gray-800">
                                  Price: {v.price || "-"} | Stock:{" "}
                                  {v.stock || "-"}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      <div className="text-gray-500">No Variants</div>
                    )}
                  </td>
                  <td className="p-2 align-top text-sm border">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                  <td className="p-2 align-top border">
                    <ProductListButtons productId={String(p._id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </div>
        <ProductListPagination page={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
