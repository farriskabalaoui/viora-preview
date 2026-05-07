import "server-only";
import { Resend } from "resend";

const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM ?? "Viora Healthcare <hello@viorahealthcare.com>";
const REPLY_TO = process.env.RESEND_REPLY_TO ?? "hello@viorahealthcare.com";

let _client: Resend | null = null;

function getClient() {
  if (!API_KEY) throw new Error("Resend not configured: missing RESEND_API_KEY");
  if (!_client) _client = new Resend(API_KEY);
  return _client;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}) {
  return getClient().emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to,
    subject,
    html,
    text,
  });
}

export function isResendConfigured() {
  return Boolean(API_KEY);
}
