/**
 * Inventory status — read-only stub for the demo.
 * Returns deterministic status per product slug.
 *
 * Phase 2: replaced with live read from Lightspeed retail API.
 */

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

const overrides: Record<string, StockStatus> = {
  "viora-premium-weight-loss-stack": "low_stock",
  "tesamorelin": "low_stock",
  "glp-3-reta": "in_stock",
  "ipamorelin": "low_stock",
  "ghk-cu": "in_stock",
  "oxytocin": "out_of_stock",
};

export function stockStatusFor(slug: string): StockStatus {
  if (overrides[slug]) return overrides[slug];
  // Deterministic fallback so the same slug always shows the same status
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  const m = Math.abs(hash) % 20;
  if (m === 0) return "out_of_stock";
  if (m < 4) return "low_stock";
  return "in_stock";
}

export function stockLabel(status: StockStatus): string {
  switch (status) {
    case "in_stock":
      return "In Stock";
    case "low_stock":
      return "Low Stock";
    case "out_of_stock":
      return "Out of Stock";
  }
}
