import CreateProduct from "@/components/seller/product/CreateProduct";
import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";

type SimpleCategory = {
  _id: string;
  main: string;
  subs: string[];
};

export default async function CreateProductPage() {
  await connectToDatabase();
  const categories = await Category.find().sort({ main: 1 }).lean();
  const simple: SimpleCategory[] = categories.map((cat: any) => ({
    _id: cat._id.toString(),
    main: cat.main,
    subs: cat.subs || [],
  }));
  return <CreateProduct categories={simple} />;
}
