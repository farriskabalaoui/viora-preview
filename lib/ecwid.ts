import "server-only";

/**
 * Ecwid (Lightspeed eCom) REST client.
 *
 * Auth model: every request needs the storeId in the path AND a token in the
 * Authorization header. The "public" token is read-only (catalog browsing,
 * inventory checks). The "secret" token can read orders + write everything.
 *
 * BLOCKED: ECWID_STORE_ID is the numeric store ID from Marvin (admin →
 * Settings → General → Store profile). Calls will throw a friendly error
 * until it's set so we don't ship silently-broken code.
 */

const STORE_ID = process.env.ECWID_STORE_ID;
const PUBLIC_TOKEN = process.env.ECWID_PUBLIC_TOKEN;
const SECRET_TOKEN = process.env.ECWID_SECRET_TOKEN;
const BASE = "https://app.ecwid.com/api/v3";

type Auth = "public" | "secret";

async function ecwidFetch<T>(path: string, init?: RequestInit & { auth?: Auth }): Promise<T> {
  if (!STORE_ID) {
    throw new Error(
      "Ecwid not configured: missing ECWID_STORE_ID (need numeric store ID from Marvin)",
    );
  }
  const auth = init?.auth ?? "public";
  const token = auth === "secret" ? SECRET_TOKEN : PUBLIC_TOKEN;
  if (!token) throw new Error(`Ecwid not configured: missing ${auth} token`);

  const url = `${BASE}/${STORE_ID}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    // Cache catalog reads for 60s on the edge to keep Ecwid quota happy
    next: auth === "public" ? { revalidate: 60 } : undefined,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Ecwid ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export type EcwidProduct = {
  id: number;
  sku: string;
  name: string;
  price: number;
  description?: string;
  enabled: boolean;
  inStock: boolean;
  quantity?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  url?: string;
  categoryIds?: number[];
};

type ProductsResponse = {
  total: number;
  count: number;
  offset: number;
  limit: number;
  items: EcwidProduct[];
};

export async function listProducts(opts: { limit?: number; offset?: number } = {}) {
  const params = new URLSearchParams();
  params.set("limit", String(opts.limit ?? 100));
  params.set("offset", String(opts.offset ?? 0));
  return ecwidFetch<ProductsResponse>(`/products?${params}`);
}

export async function getProduct(id: number) {
  return ecwidFetch<EcwidProduct>(`/products/${id}`);
}

export async function getInventory(productId: number) {
  const p = await ecwidFetch<EcwidProduct>(`/products/${productId}`);
  return { inStock: p.inStock, quantity: p.quantity ?? 0 };
}

export type EcwidOrder = {
  id: number;
  orderNumber: number;
  email: string;
  total: number;
  paymentStatus: string;
  fulfillmentStatus: string;
};

export async function listRecentOrders(limit = 50) {
  return ecwidFetch<{ items: EcwidOrder[] }>(`/orders?limit=${limit}`, { auth: "secret" });
}

export function isEcwidConfigured() {
  return Boolean(STORE_ID && PUBLIC_TOKEN);
}
