import bcrypt from "bcrypt";
import { users } from "./schema";
import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import type { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import { SchemaSignIn } from "@/types/schema-sign-in";
import { eq } from "drizzle-orm";

// Define a type for the User object NextAuth expects
type User = {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
  emailVerified?: Date | null;
  role?: string | null; // Add other fields expected by NextAuth, except for sensitive ones like password
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db) as Adapter,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET!,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = SchemaSignIn.safeParse(credentials);

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
          };

          return sanitizedUser; // Make sure this conforms to the NextAuth `User` type
        }

        return null;
      },
    }),
  ],
});
