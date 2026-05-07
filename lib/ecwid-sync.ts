import "server-only";
import { listProducts, isEcwidConfigured, type EcwidProduct } from "@/lib/ecwid";

/**
 * Hybrid catalog strategy (Option B):
 *
 * - lib/products.ts is the source of truth for content (descriptions,
 *   peptide composition, calculator metadata, photos, multi-size pricing).
 * - Ecwid is the source of truth for stock + entry-tier price.
 *
 * This file overlays Ecwid's live stock/price onto our local catalog by
 * matching local slug → Ecwid product. Most products auto-match on name
 * (case-insensitive); the rest live in NAME_OVERRIDES below.
 *
 * Caching: listProducts() uses next.revalidate=60, so we hit Ecwid at most
 * once a minute per region.
 */

/** Local slug → exact Ecwid product name (only for entries that don't auto-match). */
const NAME_OVERRIDES: Record<string, string> = {
  "viora-ceo-stack": "CEO Stack",
  "viora-metabolic-stack": "Metabolic Stack",
  "glp-3-reta": "VHC - 3(R)",
  "klow": "Klow",
};

function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

export type EcwidStock = {
  inStock: boolean;
  quantity: number | null; // null = unlimited
  ecwidPrice: number;
  ecwidId: number;
  imageUrl?: string;
};

let _cachedAt = 0;
let _cachedByName: Map<string, EcwidProduct> | null = null;

async function getProductsByName(): Promise<Map<string, EcwidProduct>> {
  // In-process memo — request-level dedupe within a single render.
  // The fetch itself is cached by Next at the data layer (revalidate=60).
  const now = Date.now();
  if (_cachedByName && now - _cachedAt < 30_000) return _cachedByName;
  const data = await listProducts({ limit: 100 });
  const byName = new Map<string, EcwidProduct>();
  for (const p of data.items) byName.set(normalize(p.name), p);
  _cachedByName = byName;
  _cachedAt = now;
  return byName;
}

export async function getEcwidStock(
  slug: string,
  localName: string,
): Promise<EcwidStock | null> {
  if (!isEcwidConfigured()) return null;
  try {
    const byName = await getProductsByName();
    const lookupName = NAME_OVERRIDES[slug] ?? localName;
    const match = byName.get(normalize(lookupName));
    if (!match) return null;
    return {
      inStock: match.inStock && match.enabled,
      quantity: match.quantity ?? null,
      ecwidPrice: match.price,
      ecwidId: match.id,
      imageUrl: match.imageUrl ?? match.thumbnailUrl,
    };
  } catch {
    // On any Ecwid failure we degrade to "unknown stock" (null) — pages
    // continue to render with the local catalog rather than 500ing.
    return null;
  }
}

export async function getStockMap(
  items: { slug: string; name: string }[],
): Promise<Map<string, EcwidStock>> {
  const out = new Map<string, EcwidStock>();
  if (!isEcwidConfigured()) return out;
  try {
    const byName = await getProductsByName();
    for (const it of items) {
      const lookupName = NAME_OVERRIDES[it.slug] ?? it.name;
      const match = byName.get(normalize(lookupName));
      if (match) {
        out.set(it.slug, {
          inStock: match.inStock && match.enabled,
          quantity: match.quantity ?? null,
          ecwidPrice: match.price,
          ecwidId: match.id,
          imageUrl: match.imageUrl ?? match.thumbnailUrl,
        });
      }
    }
  } catch {
    /* degrade gracefully */
  }
  return out;
}
