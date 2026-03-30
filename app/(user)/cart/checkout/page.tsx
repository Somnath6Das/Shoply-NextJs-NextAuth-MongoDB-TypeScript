import { getCart } from "@/app/actions/cartAction";
import CartCheckoutClient from "@/components/home/CartCheckoutClient";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Address from "@/models/Address";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }
  const cartResult = await getCart();
  if (!cartResult.success || !cartResult.cart?.items?.length) {
    redirect("/cart");
  }
  let address = null;
  let sellerUsernames: Record<string, string> = {};

  try {
    await connectToDatabase();

    const addressDoc = await Address.findOne({
      userId: session.user.id,
    }).lean();
    if (addressDoc) {
      address = {
        ...addressDoc,
        _id: addressDoc._id.toString(),
        userId: addressDoc.userId.toString(),
      };
    }
    const sellerIds = Array.from(
      new Set(cartResult.cart.items.map((item) => item.sellerId)),
    );

    const sellers = await User.find({ _id: { $in: sellerIds } }).lean();
    sellerUsernames = sellers.reduce(
      (acc: Record<string, string>, seller: any) => {
        acc[seller._id.toString()] = seller.username;
        return acc;
      },
      {},
    );
  } catch (error) {
    console.error("Failed to load checkout data:", error);
  }
  return (
    <CartCheckoutClient
      cart={cartResult.cart}
      address={address}
      sellerUsernames={sellerUsernames}
    />
  );
}
