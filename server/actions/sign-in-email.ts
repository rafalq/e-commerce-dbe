"use server";

import { SignInSchema } from "@/types/sign-in-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";

const actionClient = createSafeActionClient();

export const signInEmail = actionClient
  .schema(SignInSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser?.email !== email) {
      return { error: true, message: "User not found." };
    }

    return { success: true, data: { email, password, code } };
  });
