import AddCategory from "@/components/seller/AddCategory";
import SelectCategory from "@/components/seller/SelectCategory";
import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";

type SimpleCategory = {
  _id: string;
  main: string;
  subs: string[];
};

export default async function CategoryPage() {
  await connectToDatabase();

  const categories = await Category.find().sort({ main: 1 }).lean();
  const simple: SimpleCategory[] = categories.map((cat: any) => ({
    _id: cat._id.toString(),
    main: cat.main,
    subs: cat.subs || [],
  }));
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
          Category Management
        </h2>
        <AddCategory categories={simple} />
      </div>
      <SelectCategory categories={simple} />
    </div>
  );
}
