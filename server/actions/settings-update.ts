"use server";

import { SchemaSettings } from "@/types/schema-settings";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "..";
import { auth } from "../auth";
import { users } from "../schema";
import { actionClient } from ".";

export const settingsUpdate = actionClient
  .schema(SchemaSettings)
  .action(
    async ({
      parsedInput: {
        image,
        name,
        email,
        currentPassword,
        newPassword,
        isTwoFactorEnabled,
      },
    }) => {
      try {
        const session = await auth();

        if (!session) return { status: "error", message: "User not found." };

        const user = await db.query.users.findFirst({
          where: eq(users.id, session.user.id),
        });
        if (!user) return { status: "error", message: "User not found." };

        if (!!session.user.isOAuth) {
          image = undefined;
          email = undefined;
          currentPassword = undefined;
          newPassword = undefined;
          isTwoFactorEnabled = undefined;
        }

        if (newPassword) {
          if (!currentPassword) {
            return {
              status: "error",
              message:
                "Confirm your current password to change for a new password.",
            };
          }
          if (currentPassword && newPassword) {
            const passwordMatch = await bcrypt.compare(
              currentPassword,
              user.password
            );

            const passwordSame = await bcrypt.compare(
              newPassword,
              user.password
            );

            if (!passwordMatch)
              return {
                status: "error",
                message: "Current Password incorrect.",
              };

            if (passwordSame)
              return {
                status: "error",
                message: "New password is the same as the old password.",
              };
          }

          currentPassword = await bcrypt.hash(newPassword, 10);
          newPassword = undefined;
        }

        const updatedUserDetails = await db
          .update(users)
          .set({
            name,
            email,
            image,
            password: currentPassword,
            twoFactorEnabled: isTwoFactorEnabled,
          })
          .where(eq(users.id, user.id))
          .returning();

        revalidatePath("/dashboard/settings");

        return {
          status: "success",
          message: "Settings updated successfully!",
          data: updatedUserDetails,
        };
      } catch (error) {
        console.log(error);
      }
    }
  );
