import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { main, sub } = await req.json();
    if (!main) {
      return NextResponse.json(
        { error: "Main category required" },

        { status: 400 },
      );
    }
    const formattedMain = main.trim();
    const formattedSub = sub?.trim();
    const existing = await Category.findOne({ main: formattedMain });
    if (existing) {
      if (formattedSub && !existing.subs.includes(formattedSub)) {
        existing.subs.push(formattedSub);
        await existing.save();
      }
      return NextResponse.json({ success: true });
    }
    await Category.create({
      main: formattedMain,
      sub: formattedSub ? [formattedSub] : [],
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Api Error:", error);
    return NextResponse.json(
      { error: "Server Error", delails: error.message },

      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { main, sub } = await req.json();

    if (!main) {
      return NextResponse.json({ error: "Main required" }, { status: 400 });
    }
    const category = await Category.findOne({ main });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    if (sub) {
      await Category.updateOne({ main }, { $pull: { subs: sub } });
      return NextResponse.json({ success: true });
    }

    await Category.deleteOne({ main });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API ERROR: ", error);
    return NextResponse.json(
      { error: "Server Error", details: error.message },
      { status: 500 },
    );
  }
}
