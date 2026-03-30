"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";

export async function addMainCategory(formData: FormData) {
  const main = formData.get("main") as string;
  if (!main) return;

  await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/categories`,

    { main },
    { validateStatus: () => true },
  );
  revalidatePath("/seller/dashboard/categories");
}

export async function deleteMainCategory(formData: FormData) {
  const main = formData.get("main") as string;
  if (!main) return;
  await axios.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/categories`,
    { data: { main } },
  );
  revalidatePath("/seller/dashboard/categories");
}

export async function handleAddSub(main: string, sub: string) {
  await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/categories`,

    { main, sub },
    { validateStatus: () => true },
  );
  revalidatePath("/seller/dashboard/categories");
}

export async function handleDeleteSub(main: string, sub: string) {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/categories`,
    { data: { main, sub } },
  );
  revalidatePath("/seller/dashboard/categories");
}
