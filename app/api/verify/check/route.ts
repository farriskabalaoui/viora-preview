import { NextResponse } from "next/server";
import { checkVerification } from "@/lib/twilio";
import { sendEmail, isResendConfigured } from "@/lib/resend";
import { welcomeEmail } from "@/lib/email-templates";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { phone, code } = (await req.json()) as { phone?: string; code?: string };
    if (!phone || !code) {
      return NextResponse.json({ error: "phone and code required" }, { status: 400 });
    }
    const v = await checkVerification(phone, code);
    const ok = v.status === "approved";
    if (!ok) return NextResponse.json({ ok, status: v.status }, { status: 400 });

    // Approved — finalize. Two side-effects, both best-effort:
    //   1. Mark phone_verified_at on the user's profile row
    //   2. Send the welcome email (only if this is the first verification)
    // Failures here MUST NOT block the user from proceeding, so we catch + log.
    let firstVerification = false;
    try {
      const supabase = await getSupabaseServer();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: existing } = await supabase
          .from("profiles")
          .select("phone_verified_at, full_name")
          .eq("id", user.id)
          .maybeSingle();
        firstVerification = !existing?.phone_verified_at;

        await supabase
          .from("profiles")
          .update({
            phone_verified_at: new Date().toISOString(),
            phone,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (firstVerification && user.email && isResendConfigured()) {
          const tpl = welcomeEmail({
            name: existing?.full_name?.split(" ")[0] || user.email.split("@")[0],
          });
          await sendEmail({
            to: user.email,
            subject: tpl.subject,
            html: tpl.html,
            text: tpl.text,
          }).catch((err) => {
            // Resend failure shouldn't block signup completion
            console.error("welcome email failed", err);
          });
        }
      }
    } catch (err) {
      console.error("post-verify side-effect failed", err);
    }

    return NextResponse.json({ ok: true, status: v.status, firstVerification });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
