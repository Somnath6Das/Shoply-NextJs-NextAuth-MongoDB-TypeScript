import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
function shuffle(array: unknown[]) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
export async function GET() {
  try {
    await connectToDatabase();
    const result = await Product.aggregate([
      {
        $group: {
          _id: "$category.main",
          items: { $push: "$$ROOT" },
        },
      },

      {
        $project: {
          _id: 0,
          mainCategory: "$_id",
          items: 1,
        },
      },
    ]);
    const randomized = result.map((cat) => ({
      ...cat,
      items: shuffle(cat.items),
    }));

    const finalResult = shuffle(randomized);
    return NextResponse.json(finalResult);
  } catch (error) {
    console.error("Error fetch products: ", error);
    return NextResponse.json({ error: "Faild to fetch" }, { status: 500 });
  }
}
