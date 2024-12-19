import * as z from "zod";

export const SchemaResetPassword = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Invalid email address",
  }),
});

export type TypeSchemaResetPassword = z.infer<typeof SchemaResetPassword>;
