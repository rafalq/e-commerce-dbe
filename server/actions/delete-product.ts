"use server";

import { db } from "@/server/index";
import { products } from "@/server/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionClient } from "./index";

export const deleteProduct = actionClient
  .schema(
    z.object({
      id: z.number(),
      title: z.string().optional(),
    })
  )
  .action(async ({ parsedInput: { id, title } }) => {
    if (!id) {
      return { status: "error", message: "Product ID is required." };
    }
    try {
      const data = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();

      revalidatePath("/dashboard/products");

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
