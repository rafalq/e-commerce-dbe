"use server";

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
    html: `<p>Your Confirmation Code: ${token} </p>`,
  });

  if (error) {
    return error;
  }

  return data;
}
