"use server";

import { db } from "@/server";
import { auth } from "@/server/auth";
import { users } from "@/server/schema";
import { AccountSchema, PasswordSchema } from "@/types/schema/settings-schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { actionClient } from "@/server/actions";

import type { ApiResponseType } from "@/types/api-response-type";

export const updateAccount = actionClient
  .schema(AccountSchema)
  .action(
    async ({ parsedInput: { image, name, email, isTwoFactorEnabled } }) => {
      try {
        const session = await auth();

        if (!session) return { status: "error", message: "User not found" };

        const user = await db.query.users.findFirst({
          where: eq(users.id, session.user.id),
        });

        if (!user) return { status: "error", message: "User not found" };

        if (!!session.user.isOAuth) {
          image = undefined;
          email = undefined;
          isTwoFactorEnabled = undefined;
        }

        await db
          .update(users)
          .set({
            name,
            email,
            image,
            twoFactorEnabled: isTwoFactorEnabled,
          })
          .where(eq(users.id, user.id))
          .returning();

        revalidatePath("/dashboard/settings");

        return {
          status: "success",
          message: "Settings updated successfully!",
        };
      } catch (error) {
        console.error(error);
      }
    }
  );

export const updatePassword = actionClient
  .schema(PasswordSchema)
  .action(
    async ({
      parsedInput: { currentPassword, newPassword },
    }): Promise<ApiResponseType> => {
      try {
        const session = await auth();

        if (!session) return { status: "error", message: "User not found" };

        const user = await db.query.users.findFirst({
          where: eq(users.id, session.user.id),
        });
        if (!user) return { status: "error", message: "User not found" };

        // --- is new password provided
        if (newPassword?.trim().length > 0) {
          // --- no current password?
          if (currentPassword.trim().length <= 0) {
            return {
              status: "warning",
              message: "Confirm your current password",
            };
            // current password provided, --- check fot correctness?
          } else {
            const passwordMatch = await bcrypt.compare(
              currentPassword,
              user.password as string
            );

            if (!passwordMatch)
              return {
                status: "error",
                message: "Current password incorrect",
              };
          }
          // both passwords provided, --- check for similarity
          if (
            currentPassword.trim().length > 0 &&
            newPassword.trim().length > 0
          ) {
            // ---- is  the new passwords the same as the old one?
            const passwordSame = await bcrypt.compare(
              newPassword,
              user.password as string
            );

            // --- passwords are the same
            if (passwordSame)
              return {
                status: "warning",
                message: "New password is the same as the current password",
              };
          }

          const updatedPassword = await bcrypt.hash(newPassword, 10);

          await db
            .update(users)
            .set({
              password: updatedPassword,
            })
            .where(eq(users.id, user.id));

          revalidatePath("/dashboard/settings");

          return {
            status: "success",
            message: "Settings updated successfully!",
          };
        } else {
          return { status: "warning", message: "Provide your new password" };
        }
      } catch (error) {
        console.error(error);
        return { status: "error", message: `Something went wrong. ${error}` };
      }
    }
  );
