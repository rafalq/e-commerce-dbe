"use server";

import { Resend } from "resend";
import getBaseURL from "@/lib/get-base-url";
import PasswordResetEmail from "@/app/(auth)/_components/password-reset-email";
import VerificationEmail from "@/app/(auth)/_components/verification-email";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export async function sendTokenToEmail(
  email: string,
  token: string,
  path: string,
  subject: string,
  type: "verification" | "resetting"
) {
  const link = `${domain}${path}?token=${token}`;
  const appName = process.env.APP_NAME!;
  let reactEmail: React.ReactNode;

  if (type === "resetting") {
    reactEmail = PasswordResetEmail({ link, appName });
  } else if (type === "verification") {
    reactEmail = VerificationEmail({ link, appName });
  }

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: `${subject}`,
    react: reactEmail,
  });

  if (error) {
    return error;
  }

  return data;
}
