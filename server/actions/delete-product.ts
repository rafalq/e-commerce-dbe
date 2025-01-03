"use server";

import { actionClient } from "@/server/actions";
import { db } from "@/server/index";
import { products, productVariants } from "@/server/schema";
import type { ApiResponseType } from "@/types/api-response-type";
import { algoliasearch } from "algoliasearch";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const clientAlgolia = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_SECRET!
);

export const deleteProduct = actionClient
  .schema(
    z.object({
      id: z.number(),
      title: z.string().optional(),
    })
  )
  .action(async ({ parsedInput: { id, title } }): Promise<ApiResponseType> => {
    if (!id) {
      return { status: "error", message: "Product ID is required." };
    }
    try {
      const variantsForProduct = await db.query.productVariants.findMany({
        where: eq(productVariants.productId, id),
      });

      if (variantsForProduct) {
        const variantIds = Array.from([...variantsForProduct], ({ id }) =>
          id.toString()
        );
        await clientAlgolia.deleteObjects({
          indexName: "products",
          objectIDs: variantIds,
        });
      }

      const data = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();

      revalidatePath("/dashboard/products");
      revalidatePath("/");
      revalidatePath("/products/[slug]", "page");

      return {
        status: "success",
        message: `Product "${data[0].title}" deleted successfully!`,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: `Failed to delete product "${title}".`,
      };
    }
  });
