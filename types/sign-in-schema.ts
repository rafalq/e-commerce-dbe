import * as z from 'zod';

export const SignInSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address.',
  }),
  password: z.string().min(1, {
    message: 'Password required.',
  }),
  code: z.optional(z.string()),
});
