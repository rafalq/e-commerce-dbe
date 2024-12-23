import { z } from "zod";

export const NewPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    passwordConfirmation: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    token: z.string().nullable().optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;
