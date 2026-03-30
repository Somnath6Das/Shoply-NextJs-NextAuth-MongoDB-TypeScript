import { getCart } from "@/app/actions/cartAction";
import CartClient from "@/components/home/CartClient";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }
  const result = await getCart();
  if (!result.success || !result.cart) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-600">{result.error || "Failed to load cart"}</p>
      </div>
    );
  }
  return <CartClient cart={result.cart} />;
}
