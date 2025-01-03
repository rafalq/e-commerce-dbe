import { db } from "@/server";
import { SignInSchema } from "@/types/schema/sign-in-schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Stripe from "stripe";
import { accounts, users } from "./schema";

import type { Adapter } from "next-auth/adapters";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
  emailVerified?: Date | null;
  role?: string | null;
  customerId: string | null;
  // Add other fields expected by NextAuth, except for sensitive ones like password
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db) as Adapter,
  callbacks: {
    async session({ session, token }) {
      if (session && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        session.user.role = token.role as string;
      }
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      });
      if (!existingUser) return token;

      const existingAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, existingUser.id),
      });

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.image = existingUser.image;
      token.isTwoFactorEnabled = existingUser.twoFactorEnabled;
      token.isOAuth = !!existingAccount;

      return token;
    },
  },
  secret: process.env.AUTH_SECRET!,
  // maxAge - set jwt expiration date (maxAge: 30 * 24 * 60 * 60)
  session: { strategy: "jwt" },
  events: {
    createUser: async ({ user }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET!, {
        apiVersion: "2024-11-20.acacia",
      });

      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name!,
      });

      await db
        .update(users)
        .set({ customerId: customer.id })
        .where(eq(users.id, user.id!));
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    // Github({
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    //   allowDangerousEmailAccountLinking: true,
    // }),
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) return null;

          // Return a sanitized user object, excluding sensitive data like password
          const sanitizedUser: User = {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            emailVerified: user.emailVerified,
            role: user.role,
            customerId: user.customerId,
          };

          return sanitizedUser; // Make sure this conforms to the NextAuth `User` type
        }

        return null;
      },
    }),
  ],
});
