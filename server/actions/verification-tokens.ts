"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { users, verificationTokens } from "../schema";

export async function getVerificationTokenByEmail(email: string) {
  try {
    const token = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.email, email),
    });
    return token;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const tokenUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.email, email));
  }

  const verificationToken = await db
    .insert(verificationTokens)
    .values({
      token,
      expires,
      email,
      userId: tokenUser?.id as string,
    })
    .returning();

  return verificationToken;
}

export async function verifyEmail(token: string) {
  const existingToken = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.token, token),
  });

  if (!existingToken) return { status: "error", message: "Token not found." };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { status: "error", message: "Token has expired." };

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });

  if (!existingUser)
    return { status: "error", message: "Email does not exist" };

  await db
    .update(users)
    .set({
      emailVerified: new Date(),
    })
    .where(eq(users.email, existingToken.email));

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.email, existingToken.email));

  return { status: "success", message: "Email verified successfully!" };
}
