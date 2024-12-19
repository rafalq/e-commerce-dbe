"use server";

import { auth } from "../auth";
import { db } from "@/server";
import { orderProduct, orders } from "../schema";
import { actionClient } from "@/server/actions";
import { SchemaOrder } from "@/types/schema-order";
import type { TypeApiResponse } from "@/types/type-api-response";

export const createOrder = actionClient
  .schema(SchemaOrder)
  .action(
    async ({ parsedInput: { total, status, products, paymentIntentId } }) => {
      try {
        const user = await auth();

        if (!user)
          return {
            status: ["error"],
            message: "User not found",
          } as TypeApiResponse;

        const formattedTotal = +(total / 100).toFixed(2);

        const order = await db
          .insert(orders)
          .values({
            total: formattedTotal,
            status,
            paymentIntentId,
            userId: user.user.id,
          })
          .returning();

        products.map(async ({ quantity, productId, variantId }) => {
          await db.insert(orderProduct).values({
            quantity,
            orderId: order[0].id,
            productId: productId,
            productVariantId: variantId,
          });
        });

        return {
          status: ["success"],
          message: "Order added successfully!",
        } as TypeApiResponse;
      } catch (error) {
        console.error(error);
        return {
          status: ["error"],
          message:
            "Payment was successful but something went wrong with creating the receipt. Contact our customer service.",
        };
      }
    }
  );
