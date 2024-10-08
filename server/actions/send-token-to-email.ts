"use server";

import { Resend } from "resend";
import getBaseURL from "@/lib/get-base-url";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export async function sendTokenToEmail(
  email: string,
  token: string,
  path: string,
  subject: string,
  text?: string
) {
  const link = `${domain}${path}?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: `${subject}`,
    html: `<p>Click <a href='${link}'>here </a>${text}</p>`,
  });

  if (error) {
    return error;
  }

  return data;
}
