import * as z from "zod";

export const SchemaSignUp = z
  .object({
    name: z
      .string()
      .min(4, { message: "Name must be at least 4 characters long" }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
    passwordConfirmation: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
  })
  // .refine((data) => data.password === data.passwordConfirmation, {
  //   message: "Passwords do not match.",
  //   path: ["password"], // First, set the error path to `password`
  // })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });
