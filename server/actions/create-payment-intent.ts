"use server";

import { actionClient } from "@/server/actions";
import { auth } from "@/server/auth";
import { SchemaPaymentIntent } from "@/types/schema-payment-intent";

import Stripe from "stripe";

import type { TypeApiResponse } from "@/types/type-api-response";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { users } from "@/server/schema";

export type TypePaymentIntentSuccessData = {
  paymentIntentId: string;
  clientSecretId: string | null;
  user: string;
};

const stripe = new Stripe(process.env.STRIPE_SECRET!);

export const createPaymentIntent = actionClient
  .schema(SchemaPaymentIntent)
  .action(async ({ parsedInput: { amount, cart, currency } }) => {
    try {
      const session = await auth();

      if (!session)
        return {
          status: ["error"],
          message: "Please login to continue",
        } as TypeApiResponse;

      if (!session?.user.id) {
        return {
          status: ["error"],
          message: "User not found. Sign out and sign in",
        } as TypeApiResponse;
      }

      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
      });

      if (!existingUser)
        return {
          status: ["error"],
          message: "User not found",
        } as TypeApiResponse;

      if (!amount)
        return {
          status: ["error"],
          message: "No Product to checkout",
        } as TypeApiResponse;

      if (amount <= 0) {
        throw new Error("Payment amount must be greater than 0.");
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },

        metadata: {
          cart: JSON.stringify(cart),
        },
      });

      return {
        status: ["success"],
        message: "Payment succeeded",
        data: {
          paymentIntentId: paymentIntent.id,
          clientSecretId: paymentIntent.client_secret,
          user: session.user.email,
        } as TypePaymentIntentSuccessData,
      } as TypeApiResponse;
    } catch (error) {
      console.error(error);
      return {
        status: ["error"],
        message: error,
      };
    }
  });
