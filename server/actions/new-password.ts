"use server";

import { NewPasswordSchema } from "@/types/schema/new-password-schema";
import { actionClient } from ".";
import {
  generateEmailVerificationToken,
  getResetPasswordTokenByToken,
} from "./tokens";
import { resetPasswordTokens, users } from "@/server/schema";
import { eq } from "drizzle-orm";
import { db } from "..";
import { sendTokenToEmail } from "@/server/actions/send-token-to-email";
import bcrypt from "bcrypt";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import type { ApiResponseType } from "@/types/api-response-type";

export const newPassword = actionClient
  .schema(NewPasswordSchema)
  .action(
    async ({
      parsedInput: { password, passwordConfirmation, token },
    }): Promise<ApiResponseType> => {
      try {
        const pool = new Pool({ connectionString: process.env.NEON_DB_URL });
        const dbPool = drizzle(pool);

        // --- has token?
        if (!token) {
          return { status: "error", message: "Missing token." };
        }

        // --- has token or is token valid?
        const existingToken = await getResetPasswordTokenByToken(token);

        if (!existingToken || "status" in existingToken) {
          return { status: "error", message: "Token not found." };
        } else {
          // --- did token expire?
          const hasExpired = new Date(existingToken.expires) < new Date();

          if (hasExpired)
            return {
              status: "error",
              message:
                'Token has expired. Get a new one by clicking "Forgot password" link.',
            };
        }

        // --- is user in database?
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, existingToken.email),
        });

        if (!existingUser) {
          return {
            status: "error",
            message: "User not found. Sign up first.",
          };
        } else {
          // --- is user's email verified?
          if (!existingUser.emailVerified) {
            const verificationToken = await generateEmailVerificationToken(
              existingUser.email as string
            );
            await sendTokenToEmail(
              verificationToken[0].email,
              verificationToken[0].token,
              "/verification",
              "E-commerce DBE Confirmation Email",
              "verification"
            );

            return {
              status: "success",
              message: "Verification token sent to your email.",
              payload: { redirect: "/" },
            };
          }
        }

        // --- do password and passwordConfirmation match?
        if (password !== passwordConfirmation) {
          return {
            status: "error",
            message: "Passwords do not match.",
          };
        }

        // --- hash password ---
        const hashedPassword = await bcrypt.hash(password, 10);

        // --- use transaction to update the password
        await dbPool.transaction(async (tx) => {
          await tx
            .update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, existingUser.id));
          await tx
            .delete(resetPasswordTokens)
            .where(eq(resetPasswordTokens.id, existingToken.id));
        });

        return {
          status: "success",
          message: "Password updated successfully!",
          payload: { redirect: "/sign-in" },
        };
      } catch (error) {
        console.error(error);
        return { status: "error", message: `Something went wrong: ${error}` };
      }
    }
  );
