import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";
import { welcomeEmail } from "@/lib/email-templates";

// Internal smoke-test endpoint. POST { to, name } and we'll send the welcome
// template via Resend so we can confirm the wiring without going through
// the full signup flow. Will be removed before launch.
export async function POST(req: Request) {
  try {
    const { to, name } = (await req.json()) as { to?: string; name?: string };
    if (!to) return NextResponse.json({ error: "to required" }, { status: 400 });
    const tpl = welcomeEmail({ name: name ?? "Researcher" });
    const r = await sendEmail({ to, subject: tpl.subject, html: tpl.html, text: tpl.text });
    return NextResponse.json(r);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
