/**
 * ClickBrick (resold by Payrio) payment gateway client.
 *
 * Ported from their official WooCommerce plugin (`hosted-checkout-gateway.php`
 * v1.6.5, https://github.com/HS-Pay/woocommerce-gateway). Same API surface,
 * just rewritten in TypeScript for our Next.js server routes.
 *
 * Integration model: Hosted Payment Page (redirect flow). We don't ever
 * touch the card details — ClickBrick collects them on their own domain,
 * which keeps us out of PCI scope entirely. Our flow:
 *
 *   1. User clicks Checkout → POST /api/checkout/clickbrick/start
 *   2. That route calls createSession() here → ClickBrick returns paymentURL
 *   3. Browser is redirected to paymentURL (clickbrickco.com domain)
 *   4. User completes payment there
 *   5. ClickBrick redirects browser back to our successURL
 *   6. /api/checkout/clickbrick/return calls getSession() to verify status
 *
 * Env vars required:
 *   KONA_API_KEY          - the secret (kona_prod_... or kona_test_...)
 *   CLICKBRICK_VENDOR_ID  - the merchant's Vendor/App ID (24-char hex)
 *   CLICKBRICK_API_DOMAIN - optional, defaults to clickbrickco.com
 */
import "server-only";

const DEFAULT_API_DOMAIN = "clickbrickco.com";

function getApiBase(): string {
  const domain = process.env.CLICKBRICK_API_DOMAIN ?? DEFAULT_API_DOMAIN;
  // Per the WooCommerce plugin's kc_get_api_domain(): prefix the configured
  // domain with `api.` and pin to /v1. Localhost / docker-internal pass
  // through unchanged for dev relays.
  const host =
    domain.startsWith("localhost") || domain.includes(":")
      ? domain
      : `api.${domain}`;
  const scheme = domain.startsWith("localhost") ? "http" : "https";
  return `${scheme}://${host}/v1`;
}

function getSecretKey(): string {
  const k = process.env.KONA_API_KEY;
  if (!k) {
    throw new Error(
      "ClickBrick not configured: KONA_API_KEY missing from environment",
    );
  }
  return k;
}

function getVendorId(): string {
  const v = process.env.CLICKBRICK_VENDOR_ID;
  if (!v) {
    throw new Error(
      "ClickBrick not configured: CLICKBRICK_VENDOR_ID missing from environment",
    );
  }
  return v;
}

// Random UUID for idempotency / request correlation. Uses Web Crypto which
// is available in Next.js's Edge + Node runtimes.
function uuid(): string {
  // crypto.randomUUID exists in modern Node + Edge runtimes
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Defensive fallback
  return (
    Math.random().toString(36).slice(2) +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2)
  );
}

// ─── Public types — mirror ClickBrick's response shapes ──────────────

export type ClickBrickLineItem = {
  /** Display name shown on the hosted checkout */
  name: string;
  /** Unit amount in major currency units (e.g. "19.99") as a string */
  amount: string;
  /** Whole number quantity */
  quantity: number;
  /** Optional SKU for the merchant's records */
  sku?: string;
  /** Optional metadata (e.g. peptide slug, batch) */
  metadata?: Record<string, string | number>;
};

export type ClickBrickCustomerDetails = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  billingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    region?: string;
    country?: string;
    zipcode?: string;
  };
};

export type CreateSessionInput = {
  /** Major-units amount as a string with 2 decimals, e.g. "129.00" */
  amount: string;
  /** ISO 4217 currency code, lowercase (e.g. "usd") */
  currency: string;
  /** Itemized contents shown on hosted checkout */
  lineItems: ClickBrickLineItem[];
  /** URL ClickBrick redirects to after a successful payment */
  successURL: string;
  /** URL the customer is sent to if they hit "back to store" */
  returnURL: string;
  /** URL ClickBrick redirects to if the user cancels */
  cancelURL: string;
  /** Pre-fill the hosted checkout form (optional) */
  customerDetails?: ClickBrickCustomerDetails;
  /** Free-form key/value pairs returned in webhooks + session lookups */
  metadata?: Record<string, string | number | boolean | null>;
  /** Optional override; defaults to "payment" (one-time charge) */
  mode?: "payment" | "subscription";
  /** "prod" for live, "test" for sandbox */
  env?: "prod" | "test";
};

export type CreateSessionResponse = {
  paymentURL: string;
  session: { _id: string; [k: string]: unknown };
  requestID?: string;
};

export type ClickBrickSession = {
  _id: string;
  status?: string; // "pending" | "completed" | "failed" | "cancelled" | ...
  amount?: string;
  currency?: string;
  metadata?: Record<string, unknown>;
  [k: string]: unknown;
};

export type ClickBrickTransaction = {
  _id: string;
  sessionId?: string;
  status?: string;
  amount?: string;
  currency?: string;
  createdAt?: string;
  [k: string]: unknown;
};

// ─── Internal request helper ─────────────────────────────────────────

type ApiResponse<T> = { ok: true; status: number; data: T } | { ok: false; status: number; error: string };

async function apiRequest<T = unknown>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
  idempotencyKey?: string,
): Promise<ApiResponse<T>> {
  const url = `${getApiBase()}/${path.replace(/^\//, "")}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-KEY": getSecretKey(),
    "User-Agent": "Viora-Healthcare/1.0 (Next.js)",
  };
  if (
    idempotencyKey &&
    (method === "POST" || method === "PUT" || method === "DELETE")
  ) {
    headers["Idempotency-Key"] = idempotencyKey;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      // Server-side fetch — no CORS, no credentials
    });
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: `Network error talking to ClickBrick: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  // ClickBrick responses are JSON. Defensive parse.
  let parsed: unknown;
  try {
    parsed = await res.json();
  } catch {
    parsed = {};
  }

  if (!res.ok) {
    const err =
      (parsed as { error?: string; message?: string })?.error ??
      (parsed as { message?: string })?.message ??
      `HTTP ${res.status}`;
    return { ok: false, status: res.status, error: err };
  }

  // ClickBrick wraps successes in { data: ... }. Unwrap so callers get
  // the actual payload without having to remember the envelope.
  const body_ = parsed as { data?: T } | T;
  const data = (body_ as { data?: T })?.data ?? (body_ as T);
  return { ok: true, status: res.status, data };
}

// ─── Public API ──────────────────────────────────────────────────────

/**
 * Create a hosted checkout session. Returns the URL to redirect the
 * customer to. They complete payment on ClickBrick's domain, then get
 * redirected back to our successURL.
 */
export async function createSession(input: CreateSessionInput) {
  const payload = {
    vendor: getVendorId(),
    env: input.env ?? "prod",
    mode: input.mode ?? "payment",
    currency: input.currency.toLowerCase(),
    amount: input.amount,
    lineItems: input.lineItems,
    successURL: input.successURL,
    returnURL: input.returnURL,
    cancelURL: input.cancelURL,
    ...(input.customerDetails ? { customerDetails: input.customerDetails } : {}),
    ...(input.metadata ? { metadata: input.metadata } : {}),
  };

  return apiRequest<CreateSessionResponse>(
    "POST",
    "checkout/sessions/create",
    payload,
    `create_${uuid()}`,
  );
}

/** Look up the current state of a session — used after redirect-back. */
export async function getSession(sessionId: string) {
  return apiRequest<ClickBrickSession>(
    "GET",
    `checkout/sessions/${encodeURIComponent(sessionId)}`,
  );
}

/** List transactions associated with a session. */
export async function getTransactionsForSession(sessionId: string) {
  return apiRequest<ClickBrickTransaction[]>(
    "GET",
    `transactions?sessionId=${encodeURIComponent(sessionId)}`,
  );
}

/** Issue a refund against a specific transaction. */
export async function refundTransaction(
  transactionId: string,
  amount?: string,
  reason?: string,
) {
  const payload: Record<string, unknown> = {};
  if (amount !== undefined) payload.amount = amount;
  if (reason !== undefined) payload.reason = reason;

  return apiRequest<ClickBrickTransaction>(
    "POST",
    `transactions/${encodeURIComponent(transactionId)}/refund`,
    Object.keys(payload).length ? payload : undefined,
    `refund_${transactionId}_${uuid()}`,
  );
}
