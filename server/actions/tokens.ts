"use server";

import { eq } from "drizzle-orm";
import { db } from "@/server/index";
import {
  resetPasswordTokens,
  twoFactorTokens,
  users,
  verificationTokens,
} from "@/server/schema";
import { randomInt } from "crypto";
import type { TypeApiResponse } from "@/types/type-api-response";

// --- email verification ---

export async function getEmailVerificationTokenByEmail(email: string) {
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

export async function generateEmailVerificationToken(email: string) {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const tokenUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  const existingToken = await getEmailVerificationTokenByEmail(email);

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

  if (!existingToken)
    return { status: ["error"], message: "Token not found" } as TypeApiResponse;

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired)
    return {
      status: ["error"],
      message: "Token has expired",
    } as TypeApiResponse;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });

  if (!existingUser)
    return {
      status: ["error"],
      message: "Email does not exist",
    } as TypeApiResponse;

  await db
    .update(users)
    .set({
      emailVerified: new Date(),
    })
    .where(eq(users.email, existingToken.email));

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.email, existingToken.email));

  return {
    status: ["success"],
    message: "Email verified successfully!",
  } as TypeApiResponse;
}

// ---- reset password ---

export async function generateResetPasswordToken(email: string) {
  try {
    const newToken = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getResetPasswordTokenByEmail(email);

    if (existingToken) {
      await db
        .delete(resetPasswordTokens)
        .where(eq(resetPasswordTokens.email, email));
    }

    const tokenUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    const resetPasswordToken = db
      .insert(resetPasswordTokens)
      .values({
        token: newToken,
        expires,
        email,
        userId: tokenUser?.id as string,
      })
      .returning();

    return resetPasswordToken;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getResetPasswordTokenByToken(token: string) {
  try {
    const resetPasswordToken = await db.query.resetPasswordTokens.findFirst({
      where: eq(resetPasswordTokens.token, token),
    });
    return resetPasswordToken;
  } catch (error) {
    return {
      status: ["error"],
      message: error || "Token not found.",
    } as TypeApiResponse;
  }
}

export async function getResetPasswordTokenByEmail(email: string) {
  try {
    const token = await db.query.resetPasswordTokens.findFirst({
      where: eq(resetPasswordTokens.email, email),
    });
    return token;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// --- two factor authentication ---

export async function generateTwoFactorToken(email: string) {
  try {
    const newToken = randomInt(100000, 1000000);

    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getTwoFactorTokenByEmail(email);

    if (existingToken) {
      await db.delete(twoFactorTokens).where(eq(twoFactorTokens.email, email));
    }

    const tokenUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    const twoFactorToken = db
      .insert(twoFactorTokens)
      .values({
        token: newToken.toString(),
        expires,
        email,
        userId: tokenUser?.id as string,
      })
      .returning();

    return twoFactorToken;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTwoFactorTokenByEmail(email: string) {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.email, email),
    });
    return twoFactorToken;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTwoFactorTokenByToken(token: string) {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(resetPasswordTokens.token, token),
    });
    return twoFactorToken;
  } catch (error) {
    console.error(error);
    return null;
  }
}
