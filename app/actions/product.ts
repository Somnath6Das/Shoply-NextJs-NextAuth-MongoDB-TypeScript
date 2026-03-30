"use server";

import Product from "@/models/Product";

export async function updateProductAction(id: string, data: any) {
  await Product.findByIdAndUpdate(id, data, { new: true });
}
