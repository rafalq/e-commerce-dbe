"use server";

import { SchemaSettings } from "@/types/schema-settings";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "..";
import { auth } from "../auth";
import { users } from "../schema";
import { actionClient } from ".";
import { hasChanges } from "@/lib/has-changes";

export const updateSettings = actionClient
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
        let updatedUserDetails = null;

        if (!session) return { status: ["error"], message: "User not found." };

        const user = await db.query.users.findFirst({
          where: eq(users.id, session.user.id),
        });
        if (!user) return { status: ["error"], message: "User not found." };

        const hasUpdates = hasChanges({
          currentData: user,
          newData: { name, email, image, twoFactorEnabled: isTwoFactorEnabled },
        });

        if (!hasUpdates && !newPassword) {
          return {
            status: ["warning"],
            message: "No changes detected to update.",
          };
        }

        if (!!session.user.isOAuth) {
          image = undefined;
          email = undefined;
          currentPassword = undefined;
          newPassword = undefined;
          isTwoFactorEnabled = undefined;
        }

        if (newPassword !== undefined && newPassword?.trim().length > 0) {
          if (!currentPassword) {
            return {
              status: ["error"],
              message: "Confirm your current password",
            };
          }
          if (currentPassword && newPassword) {
            const passwordMatch = await bcrypt.compare(
              currentPassword,
              user.password as string
            );

            const passwordSame = await bcrypt.compare(
              newPassword,
              user.password as string
            );

            if (!passwordMatch)
              return {
                status: ["error"],
                message: "Current password incorrect",
              };

            if (passwordSame)
              return {
                status: ["error"],
                message: "New password is the same as the current password",
              };
          }

          currentPassword = await bcrypt.hash(newPassword, 10);
          newPassword = undefined;

          updatedUserDetails = await db
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
        } else {
          updatedUserDetails = await db
            .update(users)
            .set({
              name,
              email,
              image,
              password: user.password,
              twoFactorEnabled: isTwoFactorEnabled,
            })
            .where(eq(users.id, user.id))
            .returning();
        }

        revalidatePath("/dashboard/settings");

        return {
          status: ["success"],
          message: "Settings updated successfully!",
          data: updatedUserDetails,
        };
      } catch (error) {
        console.log(error);
      }
    }
  );
