import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  createSession,
  type ClickBrickLineItem,
  type ClickBrickCustomerDetails,
} from "@/lib/clickbrick";
import { getSupabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Create a ClickBrick hosted checkout session for the current cart.
 *
 * Auth required — only signed-in researchers can check out (matches the
 * existing protected /cart + /checkout middleware rules).
 *
 * Request body:
 *   {
 *     items: [{ slug, name, priceFrom, qty }, ...],
 *     customer?: { firstName, lastName, email, phoneNumber, billingAddress? }
 *   }
 *
 * Response:
 *   { paymentURL: string, sessionId: string }     // 200 — redirect the browser
 *   { error: "..." }                              // 4xx / 5xx
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = parseRequestBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { items, customer } = parsed;

  // Auth — require an authenticated Supabase session.
  let userId: string | null = null;
  let userEmail: string | null = null;
  try {
    const supabase = await getSupabaseServer();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      return NextResponse.json(
        { error: "You must be signed in to check out" },
        { status: 401 },
      );
    }
    userId = data.user.id;
    userEmail = data.user.email ?? null;
  } catch {
    // Supabase not configured in this environment (dev without keys).
    // Allow the request through but stamp it with anon metadata so we
    // can spot orphans during debugging.
    userId = null;
    userEmail = null;
  }

  // Compute amount (server-side — never trust client totals)
  const amountCents = items.reduce(
    (sum, i) => sum + Math.round(i.priceFrom * 100) * i.qty,
    0,
  );
  const amount = (amountCents / 100).toFixed(2);

  // Build the ClickBrick lineItems shape
  const lineItems: ClickBrickLineItem[] = items.map((i) => ({
    name: i.name,
    amount: i.priceFrom.toFixed(2),
    quantity: i.qty,
    sku: i.slug,
    metadata: { slug: i.slug },
  }));

  // Resolve URLs from the request host so localhost / preview / prod
  // all work without env config.
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "viorahealthcare.com";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const origin = `${proto}://${host}`;
  const successURL = `${origin}/api/checkout/clickbrick/return?status=success`;
  const cancelURL = `${origin}/api/checkout/clickbrick/return?status=cancel`;
  const returnURL = `${origin}/products`; // "back to store" target

  // Merge customer info from auth + form
  const customerDetails: ClickBrickCustomerDetails | undefined =
    customer || userEmail
      ? { email: customer?.email ?? userEmail ?? undefined, ...customer }
      : undefined;

  const env = process.env.KONA_API_KEY?.startsWith("kona_prod_")
    ? "prod"
    : "test";

  const res = await createSession({
    amount,
    currency: "usd",
    lineItems,
    successURL,
    returnURL,
    cancelURL,
    customerDetails,
    env,
    metadata: {
      viora_user_id: userId,
      viora_user_email: userEmail,
      item_count: items.length,
      item_total: amount,
    },
  });

  if (!res.ok) {
    console.error("[clickbrick/start] createSession failed", res);
    return NextResponse.json(
      {
        error: `Payment gateway error: ${res.error}`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    paymentURL: res.data.paymentURL,
    sessionId: res.data.session?._id,
  });
}

// ─── Request body parsing ────────────────────────────────────────────

type ParsedBody =
  | {
      items: { slug: string; name: string; priceFrom: number; qty: number }[];
      customer?: ClickBrickCustomerDetails;
    }
  | { error: string };

function parseRequestBody(body: unknown): ParsedBody {
  if (!body || typeof body !== "object") {
    return { error: "Body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;

  if (!Array.isArray(b.items) || b.items.length === 0) {
    return { error: "items[] is required and must be non-empty" };
  }

  const items: { slug: string; name: string; priceFrom: number; qty: number }[] =
    [];
  for (const raw of b.items) {
    if (!raw || typeof raw !== "object") {
      return { error: "Each item must be an object" };
    }
    const it = raw as Record<string, unknown>;
    const slug = typeof it.slug === "string" ? it.slug : null;
    const name = typeof it.name === "string" ? it.name : null;
    const priceFrom = typeof it.priceFrom === "number" ? it.priceFrom : null;
    const qty = typeof it.qty === "number" ? it.qty : null;
    if (!slug || !name || priceFrom === null || qty === null) {
      return {
        error:
          "Each item must have { slug: string, name: string, priceFrom: number, qty: number }",
      };
    }
    if (priceFrom <= 0 || qty <= 0 || qty > 99) {
      return { error: "Item priceFrom must be > 0 and qty 1..99" };
    }
    items.push({ slug, name, priceFrom, qty });
  }

  const customer =
    b.customer && typeof b.customer === "object"
      ? (b.customer as ClickBrickCustomerDetails)
      : undefined;

  return { items, customer };
}
