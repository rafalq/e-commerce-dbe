import * as z from "zod";

export const PasswordResetSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Invalid email address",
  }),
});

export type PasswordResetSchemaType = z.infer<typeof PasswordResetSchema>;
