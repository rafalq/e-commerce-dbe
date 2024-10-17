import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  role: string;
  image: string;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
