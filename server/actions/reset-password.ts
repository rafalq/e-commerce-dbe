"use server";

import { SchemaResetPassword } from "@/types/schema-reset-password";
import type { TypeApiResponse } from "@/types/type-api-response";
import { eq } from "drizzle-orm";
import { actionClient } from ".";
import { db } from "..";
import { users } from "../schema";
import { sendTokenToEmail } from "./send-token-to-email";
import { generateResetPasswordToken } from "./tokens";

export const resetPassword = actionClient
  .schema(SchemaResetPassword)
  .action(async ({ parsedInput: { email } }) => {
    try {
      // --- is user in database?
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!existingUser) {
        return {
          status: ["error"],
          message: "User not found",
        } as TypeApiResponse;
      }

      const resetPasswordToken = await generateResetPasswordToken(email);

      if (!resetPasswordToken) {
        return {
          status: ["error"],
          message: "Token not generated. Try one more time",
        } as TypeApiResponse;
      }

      sendTokenToEmail(
        resetPasswordToken[0].email,
        resetPasswordToken[0].token,
        "/auth/new-password",
        "Reset Password",
        "to change your password."
      );

      return {
        status: ["success"],
        message: "Instructions sent to your email",
        data: { redirect: "/" },
      } as TypeApiResponse;
    } catch (error) {
      console.error(error);
    }
  });
