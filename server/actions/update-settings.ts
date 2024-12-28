"use server";

import { db } from "@/server";
import { auth } from "@/server/auth";
import { users } from "@/server/schema";
import { AccountSchema, PasswordSchema } from "@/types/settings-schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { actionClient } from ".";

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

        // const dbData = {
        //   name: user.name,
        //   email: user.email,
        //   image: user.image,
        //   twoFactorEnabled: user.twoFactorEnabled,
        // };

        // const formData = {
        //   name,
        //   email,
        //   image,
        //   twoFactorEnabled: isTwoFactorEnabled,
        // };

        // const hasChanges = !isEqual(dbData, formData);

        // if (!hasChanges) {
        //   return {
        //     status: "warning",
        //     message: "No changes detected to update",
        //   };
        // }

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
            password: user.password,
            twoFactorEnabled: isTwoFactorEnabled,
          })
          .where(eq(users.id, user.id))
          .returning();

        revalidatePath("/dashboard/settings");

        return {
          status: "success",
          message: "Settings updated successfully!",
          // payload: updatedUserDetails,
        };
      } catch (error) {
        console.log(error);
      }
    }
  );

export const updatePassword = actionClient
  .schema(PasswordSchema)
  .action(async ({ parsedInput: { currentPassword, newPassword } }) => {
    try {
      const session = await auth();

      if (!session) return { status: "error", message: "User not found" };

      const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
      });
      if (!user) return { status: "error", message: "User not found" };

      // const hasChanges =
      //   currentPassword.trim().length > 0 || newPassword.trim().length > 0;

      // if (!hasChanges && !newPassword) {
      //   return {
      //     status: "warning",
      //     message: "No changes detected to update.",
      //   };
      // }

      if (newPassword !== undefined && newPassword?.trim().length > 0) {
        if (!currentPassword) {
          return {
            status: "error",
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
              status: "error",
              message: "Current password incorrect",
            };

          if (passwordSame)
            return {
              status: "error",
              message: "New password is the same as the current password",
            };
        }

        currentPassword = await bcrypt.hash(newPassword, 10);
        newPassword = "";

        db.update(users)
          .set({
            password: currentPassword,
          })
          .where(eq(users.id, user.id))
          .returning();
      } else {
        await db
          .update(users)
          .set({
            password: user.password,
          })
          .where(eq(users.id, user.id))
          .returning();
      }

      revalidatePath("/dashboard/settings");

      return {
        status: "success",
        message: "Settings updated successfully!",
      };
    } catch (error) {
      console.log(error);
    }
  });

// export const updateSettings = actionClient
// .schema(SchemaSettings)
// .action(
//   async ({
//     parsedInput: {
//       image,
//       name,
//       email,
//       currentPassword,
//       newPassword,
//       isTwoFactorEnabled,
//     },
//   }) => {
//     try {
//       const session = await auth();
//       let updatedUserDetails = null;

//       if (!session) return { status: "error", message: "User not found." };

//       const user = await db.query.users.findFirst({
//         where: eq(users.id, session.user.id),
//       });
//       if (!user) return { status: "error", message: "User not found." };

//       const hasChanges = hasChanges({
//         currentData: user,
//         newData: { name, email, image, twoFactorEnabled: isTwoFactorEnabled },
//       });

//       if (!hasChanges && !newPassword) {
//         return {
//           status: "warning",
//           message: "No changes detected to update.",
//         };
//       }

//       if (!!session.user.isOAuth) {
//         image = undefined;
//         email = undefined;
//         currentPassword = undefined;
//         newPassword = undefined;
//         isTwoFactorEnabled = undefined;
//       }

//       if (newPassword !== undefined && newPassword?.trim().length > 0) {
//         if (!currentPassword) {
//           return {
//             status: "error",
//             message: "Confirm your current password",
//           };
//         }
//         if (currentPassword && newPassword) {
//           const passwordMatch = await bcrypt.compare(
//             currentPassword,
//             user.password as string
//           );

//           const passwordSame = await bcrypt.compare(
//             newPassword,
//             user.password as string
//           );

//           if (!passwordMatch)
//             return {
//               status: "error",
//               message: "Current password incorrect",
//             };

//           if (passwordSame)
//             return {
//               status: "error",
//               message: "New password is the same as the current password",
//             };
//         }

//         currentPassword = await bcrypt.hash(newPassword, 10);
//         newPassword = undefined;

//         updatedUserDetails = await db
//           .update(users)
//           .set({
//             name,
//             email,
//             image,
//             password: currentPassword,
//             twoFactorEnabled: isTwoFactorEnabled,
//           })
//           .where(eq(users.id, user.id))
//           .returning();
//       } else {
//         updatedUserDetails = await db
//           .update(users)
//           .set({
//             name,
//             email,
//             image,
//             password: user.password,
//             twoFactorEnabled: isTwoFactorEnabled,
//           })
//           .where(eq(users.id, user.id))
//           .returning();
//       }

//       revalidatePath("/dashboard/settings");

//       return {
//         status: "success",
//         message: "Settings updated successfully!",
//         data: updatedUserDetails,
//       };
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );
