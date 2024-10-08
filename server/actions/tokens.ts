"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { resetPasswordTokens, users, verificationTokens } from "../schema";

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

// ---- reset password ---

export async function getResetPasswordTokenByToken(token: string) {
  try {
    const resetPasswordToken = await db.query.resetPasswordTokens.findFirst({
      where: eq(resetPasswordTokens.token, token),
    });
    return resetPasswordToken;
  } catch (error) {
    return { status: "error", message: error || "Token not found." };
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
    console.log(error);
    return null;
  }
}

// export async function getToken(token: Token) {
//   try {
//     let tokenFromDB = null;
//     if (token.receivedBy === "email") {
//       if (token.type === "email-verification") {
//         tokenFromDB = await db.query.verificationTokens.findFirst({
//           where: eq(verificationTokens.email, token.email || ""),
//         });
//         return tokenFromDB;
//       }
//       if (token.type === "reset-password") {
//         tokenFromDB = await db.query.resetPasswordTokens.findFirst({
//           where: eq(resetPasswordTokens.email, token.email || ""),
//         });
//         return tokenFromDB;
//       }
//     } else if (token.receivedBy === "token") {
//       if (token.type === "reset-password") {
//         tokenFromDB = await db.query.resetPasswordTokens.findFirst({
//           where: eq(resetPasswordTokens.token, token.token || ""),
//         });
//         return tokenFromDB;
//       }
//     }
//   } catch (error) {
//     return { status: "error", message: error || "Token not found." };
//   }
// }

// export async function generateToken(token: Token, userEmail: string) {
//   const existingToken = await getToken(token);

//   if (existingToken) {
//     if (token.type === "email-verification") {
//       await db
//         .delete(verificationTokens)
//         .where(eq(verificationTokens.email, userEmail));
//     }
//   } else if (token.type === "reset-password") {
//     await db
//       .delete(resetPasswordTokens)
//       .where(eq(resetPasswordTokens.email, userEmail));
//   }
//   const tokenUser = await db.query.users.findFirst({
//     where: eq(users.email, userEmail),
//   });

//   if (token.type === "email-verification") {
//     const tokenObj = await db
//       .insert(verificationTokens)
//       .values({
//         token: newToken,
//         expires,
//         email: userEmail,
//         userId: tokenUser?.id as string,
//       })
//       .returning();

//     return tokenObj;
//   } else if (token.type === "reset-password") {
//     const tokenObj = await db
//       .insert(resetPasswordTokens)
//       .values({
//         token: newToken,
//         expires,
//         email: userEmail,
//         userId: tokenUser?.id as string,
//       })
//       .returning();

//     return tokenObj;
//   }

//   return null;
// }
