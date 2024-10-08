"use server";

import { SchemaResetPassword } from "@/types/schema-reset-password";
import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";
import { actionClient } from "./action-client";
import { generateResetPasswordToken } from "./tokens";
import { sendTokenToEmail } from "./send-token-to-email";

export const resetPassword = actionClient
  .schema(SchemaResetPassword)
  .action(async ({ parsedInput: { email } }) => {
    try {
      // --- is user in database?
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!existingUser) {
        return { status: "error", message: "User not found." };
      }

      const resetPasswordToken = await generateResetPasswordToken(email);

      if (!resetPasswordToken) {
        return {
          status: "error",
          message: "Token not generated. Try one more time.",
        };
      }

      sendTokenToEmail(
        resetPasswordToken[0].email,
        resetPasswordToken[0].token,
        "/auth/new-password",
        "Reset Password",
        "to change your password for the new one."
      );

      return {
        status: "success",
        message: "Reset password instructions sent to your email.",
      };
    } catch (error) {
      console.error(error);
    }
  });
