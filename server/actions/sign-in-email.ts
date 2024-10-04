'use server';

import { SignInSchema } from '@/types/sign-in-schema';
import { createSafeActionClient } from 'next-safe-action';

const actionClient = createSafeActionClient();

export const signInEmail = actionClient
  .schema(SignInSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    console.log(email, password, code);
    return { email };
  });
