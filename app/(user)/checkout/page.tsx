import CheckoutClient from "@/components/home/CheckoutClient";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Address from "@/models/Address";
import Product from "@/models/Product";
import User from "@/models/User";
import { getServerSession } from "next-auth";

interface CheckoutPageProps {
  searchParams: Promise<{
    variantId?: string;
    qty?: string;
  }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;
  const variantId = params.variantId;
  const qty = Number(params.qty || 1);

  if (!variantId) {
    return <div className="p-10 text-center">Variant ID is missing</div>;
  }
  let item;
  let address;
  let seller;
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return <div className="p-10 text-center">Please sign in to checkout</div>;
    }
    const product = await Product.findOne({
      "variants._id": variantId,
    }).lean();
    if (!product) {
      return <div className="p-10 text-center">Product not found</div>;
    }
    seller = (await User.findOne({ _id: product.sellerId }).lean()) ?? null;

    const variant = product.variants.find(
      (v) => String(v._id) === String(variantId),
    );

    if (!variant) {
      return <div className="p-10 text-center">Variant not found</div>;
    }
    const addressDoc = await Address.findOne({
      userId: session.user.id,
    }).lean();

    item = {
      name: product.name,
      sellerId: String(product.sellerId),
      description: product.description,
      deliveryInDays: product.deliveryInDays,
      combination: variant.combination,
      images: variant.images,
      price: Number(variant.price),
      stock: Number(variant.stock),
      qty,
      productId: String(product._id),
      variantId: String(variant._id),
    };
    if (addressDoc) {
      address = {
        ...addressDoc,
        _id: String(addressDoc._id),
        userId: String(addressDoc.userId),
      };
    }
  } catch (error) {
    console.error(error);
    return <div className="p-10 text-center">Failed to load checkout</div>;
  }
  return (
    <CheckoutClient
      item={item}
      address={address}
      sellerUsername={seller?.username}
    />
  );
}
