"use server";

import { SignInSchema } from "@/types/sign-in-schema";
import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";
import { actionClient } from "./action-client";

import type { FormStatus } from "@/types/form-status";
import { generateVerificationToken } from "./verification-tokens";
import { sendTokenToEmail } from "./send-token-to-email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

export const signInEmail = actionClient
  .schema(SignInSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      // is user in database?
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email !== email) {
        return { status: "error", message: "User not found." } as FormStatus;
      }

      // is user's email verified?
      if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
          existingUser.email
        );
        await sendTokenToEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );

        return {
          status: "success",
          message: "Verification token sent to your email.",
        } as FormStatus;
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
