"use server";

import { Resend } from "resend";
import getBaseURL from "@/lib/get-base-url";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export async function sendTokenToEmail(email: string, token: string) {
  const confirmationLink = `${domain}/auth/verification?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "E-commerce DBE Confirmation Email",
    html: `<p>Click to <a href='${confirmationLink}'>confirm your email.</a></p>`,
  });

  if (error) {
    return error;
  }

  return data;
}
