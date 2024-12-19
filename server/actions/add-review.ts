"use server";

import { actionClient } from "@/server/actions/index";
import { auth } from "@/server/auth";
import { db } from "@/server/index";
import { reviews } from "@/server/schema";
import { SchemaReviews } from "@/types/schema-reviews";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const addReview = actionClient
  .schema(SchemaReviews)
  .action(async ({ parsedInput: { productId, rating, comment } }) => {
    try {
      const session = await auth();
      if (!session) return { status: ["error"], message: "Sign in to review" };

      const reviewExists = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productId, productId),
          eq(reviews.userId, session.user.id)
        ),
      });
      if (reviewExists)
        return {
          status: ["error"],
          message: "You have already reviewed this product",
        };

      const newReview = await db
        .insert(reviews)
        .values({
          productId,
          rating,
          comment,
          userId: session.user.id,
        })
        .returning();

      revalidatePath(`/products/${productId}`);

      return {
        status: ["success"],
        message: "Review added successfully! 👌",
        data: newReview[0],
      };
    } catch (err) {
      return { error: JSON.stringify(err) };
    }
  });
