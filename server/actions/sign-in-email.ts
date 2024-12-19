"use server";

import { actionClient } from "@/server/actions";
import { db } from "@/server/index";
import { twoFactorTokens, users } from "@/server/schema";
import { SchemaSignIn } from "@/types/schema-sign-in";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { sendTokenToEmail } from "@/server/actions/send-token-to-email";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "@/server/actions/tokens";
import { signIn } from "@/server/auth";
import type { TypeApiResponse } from "@/types/type-api-response";
import { AuthError } from "next-auth";
import { sendTwoFactorTokenToEmail } from "./send-two-factor-token-to-email";

export async function handleTwoFactorToken(
  email: string,
  apiResponse: TypeApiResponse
): Promise<TypeApiResponse> {
  const token = await generateTwoFactorToken(email);

  if (!token) {
    return { status: ["error"], message: "Code not generated" };
  }

  await sendTwoFactorTokenToEmail(
    token[0].email,
    token[0].token,
    "E-commerce DBE Two Factor Authentication Confirmation"
  );
  return apiResponse;
}

export const signInEmail = actionClient
  .schema(SchemaSignIn)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      // is user in database?
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      // user not in database!
      if (!existingUser || existingUser?.email !== email) {
        return {
          status: ["error"],
          message: "Wrong email or password",
        };
      }

      let passwordMatch;

      // is password correct?
      if (existingUser.password) {
        passwordMatch = await bcrypt.compare(password, existingUser.password);
      }

      if (!passwordMatch)
        return { status: ["error"], message: "Wrong email or password" };

      // is user's email verified?
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        );
        await sendTokenToEmail(
          verificationToken[0].email,
          verificationToken[0].token,
          "/auth/email-verification",
          "E-commerce DBE Email Confirmation",
          "to confirm your email"
        );

        return {
          status: ["success"],
          message: "Verification code was sent to your email",
        };
      }

      // is two factor auth enabled?
      if (existingUser.twoFactorEnabled) {
        // Check if a token already exists for the user
        const existingToken = await getTwoFactorTokenByEmail(
          existingUser.email
        );

        if (existingToken) {
          // If a token exists, check if the user provided a code
          if (code) {
            // Validate the provided code
            if (existingToken.token !== code) {
              return {
                status: ["two-factor", "error"],
                message: "Code is incorrect",
              };
            }

            // Check if the token has expired
            const hasExpired = new Date(existingToken.expires) < new Date();
            if (hasExpired) {
              return await handleTwoFactorToken(existingUser.email, {
                status: ["two-factor", "warning"],
                message: "Code has expired. New code was sent to your email",
              });
            }

            // Code is valid and not expired, delete the token
            await db
              .delete(twoFactorTokens)
              .where(eq(twoFactorTokens.id, existingToken.id));
          } else {
            // If no code was provided, notify the user to check their email
            return {
              status: ["two-factor", "info"],
              message: "Confirmation code has already sent to your email",
            };
          }
        } else {
          // If no token exists, generate and send a new one
          return await handleTwoFactorToken(existingUser.email, {
            status: ["two-factor", "success"],
            message: "Confirmation code was sent to your email!",
          });
        }
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return {
        status: ["success"],
        data: { email, password, code },
      };
    } catch (error) {
      console.error(error);

      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return {
              status: ["error"],
              message: "Email or password incorrect",
            };
          case "AccessDenied":
            return { status: ["error"], message: error.message };
          case "OAuthSignInError":
            return { status: ["error"], message: error.message };
          default: {
            return { status: ["error"], message: "Something went wrong" };
          }
        }
      }
      throw error;
    }
  });
