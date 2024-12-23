"use server";

import TwoFactorEmail from "@/app/(auth)/_components/two-factor-email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTwoFactorTokenToEmail(
  email: string,
  token: string,
  subject: string
) {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: `${subject}`,
    react: TwoFactorEmail({ token }),
  });

  if (error) {
    return error;
  }

  return data;
}
