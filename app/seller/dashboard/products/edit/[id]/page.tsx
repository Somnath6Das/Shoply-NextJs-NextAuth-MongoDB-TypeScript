import Product from "@/models/Product";
import Category from "@/models/Category";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EditProductPage from "@/components/seller/product/EditProductPage";

export default async function EditPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Unauthorized</div>;
  await connectToDatabase();
  const { id } = await params;

  const product = await Product.findOne({
    _id: id,
    sellerId: session.user.id,
  }).lean();
  const categories = await Category.find().lean();
  if (!product) return <div>Product Not Found</div>;
  return (
    <EditProductPage
      product={JSON.parse(JSON.stringify(product))}
      categories={JSON.parse(JSON.stringify(categories))}
    />
  );
}
