import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Logs a consent click for compliance audit.
 * - Captures IP, user agent, timestamp, consent version, stage (signup|checkout)
 * - When Supabase is wired: writes to consent_log table linked to user
 * - For now: console-logs (replaceable in 30 sec once Supabase is live)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const headers = req.headers;

    const record = {
      ts: body.ts ?? new Date().toISOString(),
      stage: body.stage ?? "unknown",
      consent_version: body.consent_version ?? "v1.0",
      ip:
        headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        headers.get("x-real-ip") ??
        "unknown",
      user_agent: headers.get("user-agent") ?? "unknown",
      referer: headers.get("referer") ?? "unknown",
    };

    // TODO: when Supabase is wired, persist to consent_log table:
    //   const supabase = await getSupabaseServer();
    //   await supabase.from("consent_log").insert(record);
    console.log("[consent-log]", record);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[consent-log] failed", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
