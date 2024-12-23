"use server";

import { db } from "@/server/index";
import { actionClient } from "@/server/actions/index";
import { SchemaProduct } from "@/types/schema-product";
import { eq } from "drizzle-orm";
import { products } from "../schema";
import { revalidatePath } from "next/cache";
import { hasChanges } from "@/lib/has-changes";

export const saveProduct = actionClient
  .schema(SchemaProduct)
  .action(async ({ parsedInput: { id, title, description, price } }) => {
    try {
      // --- check if 'edit mode'

      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });

        if (!currentProduct)
          return { status: ["error"], message: "Product not found." };

        // --- if no changes made

        const hasUpdates = hasChanges({
          currentData: currentProduct,
          newData: { title, description, price },
        });

        if (!hasUpdates) {
          return {
            status: ["warning"],
            message: "No changes detected to update",
          };
        }

        // --- else update the product

        const editedProduct = await db
          .update(products)
          .set({ description, price, title })
          .where(eq(products.id, id))
          .returning();

        revalidatePath("/dashboard/products");
        revalidatePath("/");
        revalidatePath("/products/[slug]", "page");

        return {
          status: ["success"],
          message: `Product "${editedProduct[0].title}" updated successfully!`,
        };

        // --- if not, create product
      } else {
        const newProduct = await db
          .insert(products)
          .values({ title, description, price })
          .returning();

        revalidatePath("/dashboard/products");
        revalidatePath("/");
        revalidatePath("/products/[slug]", "page");

        return {
          status: ["success"],
          message: `Product "${newProduct[0].title}" created successfully!`,
        };
      }
    } catch (error) {
      console.error(error);
      return { status: ["error"], message: "Failed to save product." };
    }
  });
