"use server";

import { db } from "@/server/index";
import { variantTypes } from "@/server/schema";
import { eq } from "drizzle-orm";

type VariantType = {
  id: number;
  type: string;
  productId: number;
  values: string[];
};

export async function getTypeWithValues(productId: number) {
  try {
    const variantType = await db.query.variantTypes.findMany({
      where: eq(variantTypes.productId, productId),
    });

    if (!variantType) throw new Error("No variant type found.");

    const typesWithVals: Record<VariantType["type"], VariantType["values"]> =
      {};

    variantType.forEach((v) => (typesWithVals[`${v.type}`] = v.values));

    return {
      status: ["success"],
      message: `Variant types have been found!`,
      data: typesWithVals as Record<VariantType["type"], VariantType["values"]>,
    };
  } catch (error) {
    console.error(error);
    return { status: ["error"], message: "Failed to get product." };
  }
}
