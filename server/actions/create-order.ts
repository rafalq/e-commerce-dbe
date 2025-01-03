"use server";

import { auth } from "../auth";
import { db } from "@/server";
import { orderProduct, orders } from "../schema";
import { actionClient } from "@/server/actions";
import { OrderSchema } from "@/types/schema/order-schema";
import type { ApiResponseType } from "@/types/api-response-type";

export const createOrder = actionClient
  .schema(OrderSchema)
  .action(
    async ({
      parsedInput: { total, status, products, paymentIntentId },
    }): Promise<ApiResponseType> => {
      try {
        const user = await auth();

        if (!user)
          return {
            status: "error",
            message: "User not found",
          };

        const order = await db
          .insert(orders)
          .values({
            total,
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
          status: "success",
          message: "Order added successfully!",
        };
      } catch (error) {
        console.error(error);
        return {
          status: "error",
          message:
            "Payment was successful but something went wrong with creating the receipt. Contact our customer service.",
        };
      }
    }
  );
