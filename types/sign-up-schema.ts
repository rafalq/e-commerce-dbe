import { patterns } from "@/app/(auth)/_const/patterns";
import * as z from "zod";

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: "Name must be at least 4 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password needs minimum 8 characters" })
      .refine((text) => patterns.password.noSpace.test(text), {
        message: "Password can not include any blank space",
      })
      .refine((text) => patterns.password.lowercase.test(text), {
        message: "Password must include at least one lowercase English letter",
      })
      .refine((text) => patterns.password.uppercase.test(text), {
        message: "Password must include at least one uppercase English letter",
      })
      .refine((text) => patterns.password.digit.test(text), {
        message: "Password must include at least one digit",
      })
      .refine((text) => patterns.password.symbol.test(text), {
        message: "Password must include at least one special character",
      }),
    passwordConfirmation: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  // .refine((data) => data.password === data.passwordConfirmation, {
  //   message: "Passwords do not match",
  //   path: ["password"], // First, set the error path to `password`
  // })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
