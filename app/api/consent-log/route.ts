import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Logs a consent click for compliance audit.
 * Stages we record: "first_visit" (research-gate modal), "signup",
 * "checkout", "reorder". user_id is null for first_visit (pre-auth).
 * Writes to public.consent_log when Supabase is configured; falls back
 * to console.log otherwise so dev still works without env.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const h = req.headers;

    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      null;
    const user_agent = h.get("user-agent") ?? null;
    const referer = h.get("referer") ?? null;
    const stage = String(body.stage ?? "unknown");
    const consent_version = String(body.consent_version ?? "v1.0");

    let user_id: string | null = null;
    let supabaseConfigured = false;
    try {
      const supabase = await getSupabaseServer();
      supabaseConfigured = true;
      const { data } = await supabase.auth.getUser();
      user_id = data.user?.id ?? null;

      const payload = {
        age_confirmed: Boolean(body.age_confirmed),
        research_use_acknowledged: Boolean(body.research_use_acknowledged),
        ...body,
      };
      delete (payload as Record<string, unknown>).stage;
      delete (payload as Record<string, unknown>).consent_version;

      const { error } = await supabase.from("consent_log").insert({
        user_id,
        stage,
        consent_version,
        ip_address: ip,
        user_agent,
        referer,
        payload,
      });
      if (error) throw error;
    } catch (err) {
      // Supabase missing or insert failed — degrade to console log so
      // dev environments without env vars still work.
      if (!supabaseConfigured) {
        console.log("[consent-log fallback]", {
          stage,
          consent_version,
          ip,
          user_agent,
          referer,
          ...body,
        });
      } else {
        console.error("[consent-log] supabase insert failed", err);
        return NextResponse.json({ ok: false }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[consent-log] failed", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
