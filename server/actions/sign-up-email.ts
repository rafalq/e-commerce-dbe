"use server";

import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";
import { actionClient } from "./action-client";
import { SchemaSignUp } from "@/types/schema-sign-up";
import { generateEmailVerificationToken } from "./tokens";
import { sendTokenToEmail } from "./send-token-to-email";
import type { FormStatus } from "@/types/form-status";

export const signUpEmail = actionClient
  .schema(SchemaSignUp)
  .action(
    async ({
      parsedInput: { name, email, password, passwordConfirmation },
    }) => {
      // --- do password and passwordConfirmation match?
      if (password !== passwordConfirmation) {
        return {
          status: "error",
          message: "Passwords do not match.",
        } as FormStatus;
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
            "E-commerce DBE Confirmation Email",
            "to confirm your email"
          );

          return {
            status: "success",
            message: "Verification token sent to your email.",
          };
        }
        return {
          status: "error",
          message: "Email already in use.",
        } as FormStatus;
      }

      await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
      });

      const verificationToken = await generateEmailVerificationToken(email);
      await sendTokenToEmail(
        verificationToken[0].email,
        verificationToken[0].token,
        "/auth/verification",
        "E-commerce DBE Confirmation Email",
        "to confirm your email."
      );

      return {
        status: "success",
        message: "Verification token sent to your email.",
      };
    }
  );
