import * as z from "zod";

export const SchemaResetPassword = z.object({
  email: z.string().min(1, { message: "Email required." }).email({
    message: "Invalid email address.",
  }),
});
