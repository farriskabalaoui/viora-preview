import { NextResponse } from "next/server";
import { sendVerification } from "@/lib/twilio";

export async function POST(req: Request) {
  try {
    const { phone } = (await req.json()) as { phone?: string };
    if (!phone || !/^\+\d{8,15}$/.test(phone)) {
      return NextResponse.json(
        { error: "Phone must be E.164 format, e.g. +19549951406" },
        { status: 400 },
      );
    }
    const v = await sendVerification(phone, "sms");
    return NextResponse.json({ status: v.status, sid: v.sid });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
