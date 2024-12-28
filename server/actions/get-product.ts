"use server";

import { db } from "@/server/index";
import type { ApiResponseStatusType } from "@/types/api-response-type";
import type { ProductSchemaType } from "@/types/product-schema";
import { eq } from "drizzle-orm";
import { products } from "../schema";

export async function getProduct(id: number): Promise<{
  status: ApiResponseStatusType;
  message: string;
  data: ProductSchemaType | null;
}> {
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
