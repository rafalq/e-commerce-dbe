"use server";

import { actionClient } from "@/server/actions/action-client";
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
import type { FormStatus } from "@/types/form-status";
import { AuthError } from "next-auth";
import { sendTwoFactorTokenToEmail } from "./send-two-factor-token-to-email";

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
          status: "error",
          message: "Wrong email or password.",
        } as FormStatus;
      }

      // is password correct?
      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!passwordMatch)
        return { status: "error", message: "Wrong email or password." };

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
          "to confirm your email."
        );

        return {
          status: "success",
          message: "Verification token sent to your email.",
        } as FormStatus;
      }

      // is two factor auth enabled?
      if (existingUser.twoFactorEnabled) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          );

          // no token in db? or token different than typed code
          if (!twoFactorToken || twoFactorToken.token !== code)
            return { status: "error", message: "Token invalid." };

          // token expired?
          const hasExpired = new Date(twoFactorToken.expires) < new Date();
          if (hasExpired)
            return { status: "error", message: "Token has expired." };

          // delete the token
          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));
        } else {
          const token = await generateTwoFactorToken(existingUser.email);

          if (!token) {
            return { status: "error", message: "Token not generated." };
          }

          await sendTwoFactorTokenToEmail(
            token[0].email,
            token[0].token,
            "E-commerce DBE Two Factor Authentication Confirmation"
          );

          return {
            status: "two-factor",
            message: "Two factor token sent to your email!",
          };
        }
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return {
        status: "success",
        data: { email, password, code },
      } as FormStatus;
    } catch (error) {
      console.error(error);

      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { status: "error", message: "Email or password incorrect." };
          case "AccessDenied":
            return { status: "error", message: error.message };
          case "OAuthSignInError":
            return { status: "error", message: error.message };
          default: {
            return { status: "error", message: "Something went wrong." };
          }
        }
      }
      throw error;
    }
  });
