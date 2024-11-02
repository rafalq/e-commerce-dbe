"use server";

import { db } from "@/server/index";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import type { ZProductToSave } from "@/app/dashboard/products/_types/product-to-save";

export async function getProduct(
  id: number
): Promise<{ status: string; message: string; data: ZProductToSave | null }> {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!product) throw new Error("Product not found.");

    return {
      status: "success",
      message: `Product "${product.title}" has been found!`,
      data: product,
    };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to get product.", data: null };
  }
}
