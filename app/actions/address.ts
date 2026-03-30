"use server";

import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Address from "@/models/Address";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function getAddress() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) return null;

    const address = await Address.findOne({ userId: session.user.id }).lean();

    return JSON.parse(JSON.stringify(address));
  } catch (error) {
    console.error(error);
  }
}
export async function saveAddress(formData: FormData) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) throw new Error("Not authenticated");
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const pin = formData.get("pin") as string;
    const phone = formData.get("phone") as string;

    await Address.findOneAndUpdate(
      {
        userId: session.user.id,
      },
      { userId: session.user.id, name, location, pin, phone },
      { upsert: true, new: true },
    );
    revalidatePath("/");
  } catch (error: any) {
    console.error(error);
  }
}
