"use server";

import { PasswordResetSchema } from "@/types/schema/password-reset-schema";
import { eq } from "drizzle-orm";
import { actionClient } from ".";
import { db } from "..";
import { users } from "../schema";
import { sendTokenToEmail } from "./send-token-to-email";
import { generateResetPasswordToken } from "./tokens";

import type { ApiResponseType } from "@/types/api-response-type";

export const resetPassword = actionClient
  .schema(PasswordResetSchema)
  .action(async ({ parsedInput: { email } }): Promise<ApiResponseType> => {
    try {
      // --- is user in database?
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!existingUser) {
        return {
          status: "error",
          message: "User not found",
        };
      }

      const resetPasswordToken = await generateResetPasswordToken(email);

      if (!resetPasswordToken) {
        return {
          status: "error",
          message: "Token not generated. Try one more time",
        };
      }

      sendTokenToEmail(
        resetPasswordToken[0].email,
        resetPasswordToken[0].token,
        "/new-password",
        "Password Reset",
        "resetting"
      );

      return {
        status: "success",
        message: "Instructions sent to your email",
        payload: { redirect: "/" },
      };
    } catch (error) {
      console.error(error);
      return { status: "error", message: `Something went wrong: ${error}` };
    }
  });
