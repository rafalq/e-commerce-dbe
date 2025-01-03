"use server";

import { SignUpSchema } from "@/types/schema/sign-up-schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { actionClient } from ".";
import { db } from "..";
import { users } from "../schema";
import { sendTokenToEmail } from "./send-token-to-email";
import { generateEmailVerificationToken } from "./tokens";
import Stripe from "stripe";

import type { ApiResponseType } from "@/types/api-response-type";

export const signUpEmail = actionClient
  .schema(SignUpSchema)
  .action(
    async ({
      parsedInput: { name, email, password, passwordConfirmation },
    }): Promise<ApiResponseType> => {
      // --- do password and passwordConfirmation match?
      if (password !== passwordConfirmation) {
        return {
          status: "error",
          message: "Passwords do not match",
        };
      }

      // --- hash password ---
      const hashedPassword = await bcrypt.hash(password, 10);

      // --- check for existing user ---
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      // --- is email already in the database? ---
      if (existingUser) {
        if (!existingUser.emailVerified) {
          const verificationToken = await generateEmailVerificationToken(email);
          await sendTokenToEmail(
            verificationToken[0].email,
            verificationToken[0].token,
            "/auth/email-verification",
            `${process.env.APP_NAME} Confirmation Email`,
            "verification"
          );

          return {
            status: "success",
            message: "Verification token sent to your email",
          };
        }
        return {
          status: "error",
          message: "Email already in use",
        };
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET!, {
        apiVersion: "2024-11-20.acacia",
      });

      const customer = await stripe.customers.create({
        email,
        name,
      });

      await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        customerId: customer.id,
      });

      const verificationToken = await generateEmailVerificationToken(email);
      await sendTokenToEmail(
        verificationToken[0].email,
        verificationToken[0].token,
        "/auth/email-verification",
        `${process.env.APP_NAME} Confirmation Email`,
        "verification"
      );

      return {
        status: "success",
        message: "Verification token sent to your email",
      };
    }
  );
