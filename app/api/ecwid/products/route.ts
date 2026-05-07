import { NextResponse } from "next/server";
import { isEcwidConfigured, listProducts } from "@/lib/ecwid";

export const revalidate = 60;

export async function GET() {
  if (!isEcwidConfigured()) {
    return NextResponse.json(
      { error: "Ecwid not configured (waiting on ECWID_STORE_ID)" },
      { status: 503 },
    );
  }
  try {
    const data = await listProducts({ limit: 100 });
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
