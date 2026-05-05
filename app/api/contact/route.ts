import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const payload = Object.fromEntries(formData.entries());

  // Demo: log to server console. In production, route to email/CRM/Slack.
  console.log("[Viora contact]", new Date().toISOString(), payload);

  // Redirect to a thank-you confirmation
  const url = new URL(req.url);
  return NextResponse.redirect(new URL("/contact?sent=1", url.origin), 303);
}
