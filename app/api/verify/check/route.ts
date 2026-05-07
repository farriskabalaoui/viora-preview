import { NextResponse } from "next/server";
import { checkVerification } from "@/lib/twilio";

export async function POST(req: Request) {
  try {
    const { phone, code } = (await req.json()) as { phone?: string; code?: string };
    if (!phone || !code) {
      return NextResponse.json({ error: "phone and code required" }, { status: 400 });
    }
    const v = await checkVerification(phone, code);
    const ok = v.status === "approved";
    return NextResponse.json({ ok, status: v.status }, { status: ok ? 200 : 400 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
