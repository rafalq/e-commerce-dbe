import { z } from "zod";

export const SchemaSettings = z
  .object({
    name: z.optional(
      z.string().min(2, { message: "Name must have minimum 2 characters" })
    ),
    image: z.optional(z.string()),
    email: z.optional(z.string().email()),
    currentPassword: z.optional(
      z.string().min(8, { message: "Password is minimum 8 characters long" })
    ),
    newPassword: z.optional(
      z
        .string()
        .min(8, { message: "Password must be minimum 8 characters long" })
    ),
    isTwoFactorEnabled: z.optional(z.boolean()),
  })
  .refine(
    (data) => {
      if (data.newPassword) {
        return !!data.currentPassword;
      }
      return true;
    },
    {
      message: "Current password is required to set a new password",
      path: ["currentPassword"],
    }
  );

export type TypeSchemaSettings = z.infer<typeof SchemaSettings>;
