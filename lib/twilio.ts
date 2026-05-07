import "server-only";
import twilio from "twilio";

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const VERIFY_SID = process.env.TWILIO_VERIFY_SID;
const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;

let _client: ReturnType<typeof twilio> | null = null;

function getClient() {
  if (!ACCOUNT_SID || !AUTH_TOKEN) {
    throw new Error(
      "Twilio not configured: missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN",
    );
  }
  if (!_client) _client = twilio(ACCOUNT_SID, AUTH_TOKEN);
  return _client;
}

export type VerifyChannel = "sms" | "call";

export async function sendVerification(phone: string, channel: VerifyChannel = "sms") {
  if (!VERIFY_SID) throw new Error("Missing TWILIO_VERIFY_SID");
  return getClient()
    .verify.v2.services(VERIFY_SID)
    .verifications.create({ to: phone, channel });
}

export async function checkVerification(phone: string, code: string) {
  if (!VERIFY_SID) throw new Error("Missing TWILIO_VERIFY_SID");
  return getClient()
    .verify.v2.services(VERIFY_SID)
    .verificationChecks.create({ to: phone, code });
}

export async function sendSms(to: string, body: string) {
  if (!FROM_NUMBER) throw new Error("Missing TWILIO_FROM_NUMBER");
  return getClient().messages.create({ to, from: FROM_NUMBER, body });
}

export function isTwilioConfigured() {
  return Boolean(ACCOUNT_SID && AUTH_TOKEN && VERIFY_SID);
}
