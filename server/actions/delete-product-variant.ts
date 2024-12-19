"use server";

import { db } from "@/server/index";
import { productVariants, variantTypes } from "@/server/schema";
import { algoliasearch } from "algoliasearch";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionClient } from "./index";

const clientAlgolia = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_SECRET!
);

export const deleteProductVariant = actionClient
  .schema(
    z.object({
      id: z.number(),
      title: z.string().optional(),
    })
  )
  .action(async ({ parsedInput: { id: variantId, title } }) => {
    if (!variantId) {
      return { status: ["error"], message: "Product variant ID is required." };
    }
    try {
      const variantToDelete = await db.query.productVariants.findFirst({
        where: eq(productVariants.id, variantId),
      });

      if (variantToDelete) {
        const variantType = await db.query.variantTypes.findFirst({
          where: and(
            eq(variantTypes.productId, variantToDelete.productId),
            eq(variantTypes.type, variantToDelete.type)
          ),
        });

        if (variantType && variantType.values) {
          if (variantType.values.length <= 1) {
            console.log("len 1", variantType.values);
            await db
              .delete(variantTypes)
              .where(eq(variantTypes.productId, variantToDelete.productId));
          } else {
            const updatedValues = variantType.values.filter(
              (val) => val !== variantToDelete.value
            );
            await db
              .update(variantTypes)
              .set({ values: updatedValues })
              .where(eq(variantTypes.productId, variantToDelete.productId));
          }
        } else {
          throw new Error("Variant type not found");
        }
      }

      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, variantId))
        .returning();

      await clientAlgolia.deleteObject({
        indexName: "products",
        objectID: variantId.toString(),
      });

      revalidatePath("/dashboard/products");
      revalidatePath("/products/[slug]", "page");

      return {
        status: ["success"],
        message: `Variant "${deletedVariant[0].title}" deleted successfully!`,
      };
    } catch (error) {
      console.error(error);
      return {
        status: ["error"],
        message: `Failed to delete variant "${title}"`,
      };
    }
  });
