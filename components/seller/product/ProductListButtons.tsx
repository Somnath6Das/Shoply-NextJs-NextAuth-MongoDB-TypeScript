"use client";
import { deleteProduct } from "@/features/deleteProduct";
import { useRouter } from "next/navigation";

type Props = {
  productId?: string;
};

export default function ProductListButtons({ productId }: Props) {
  const router = useRouter();
  const handleEdit = (id?: string) => {
    if (!id) return;
    router.push(`/seller/dashboard/products/edit/${id}`);
  };
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await deleteProduct(id);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => handleEdit(productId)}
        className="px-10 py-1 rounded bg-yellow-500 text-white text-sm"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(productId)}
        className="px-8 py-1 rounded bg-red-500 text-white text-sm"
      >
        Delete
      </button>
    </div>
  );
}
