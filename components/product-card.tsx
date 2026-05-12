"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { STACK_PEPTIDES, BLEND_PEPTIDES } from "@/lib/products";
import { ProductPhoto } from "@/components/product-photo";
import { stockStatusFor, type StockStatus } from "@/lib/stock";
import { useI18n } from "@/lib/i18n-context";

export function ProductCard({
  product,
  stock: stockOverride,
}: {
  product: Product;
  /** Live stock from Ecwid (server-fetched). Falls back to local stub when omitted. */
  stock?: StockStatus;
}) {
  const stock = stockOverride ?? stockStatusFor(product.slug);
  const { t } = useI18n();

  const peptides =
    product.peptides ??
    STACK_PEPTIDES[product.slug] ??
    BLEND_PEPTIDES[product.slug];

  // Single eyebrow label — was previously rendering both a top-left
  // "STACK" badge AND a "HORMONE" tag eyebrow which read as visual
  // noise. Prefer first-tag if present, otherwise the category.
  const eyebrow = product.tags?.[0] ?? product.category;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex h-[520px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(31,38,71,0.04),0_8px_24px_-12px_rgba(31,38,71,0.10)] ring-1 ring-black/[0.04] transition-all hover:-translate-y-1 hover:shadow-[0_4px_8px_rgba(31,38,71,0.06),0_24px_40px_-12px_rgba(31,38,71,0.18)] hover:ring-black/[0.08]"
    >
      {/* Stock badge — only when something needs flagging */}
      {stock !== "in_stock" && (
        <span
          className={`absolute right-4 top-4 z-10 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
            stock === "low_stock"
              ? "bg-amber-100 text-amber-900"
              : "bg-rose-100 text-rose-900"
          }`}
        >
          {stock === "low_stock" ? t("product.low_stock") : t("product.out_of_stock")}
        </span>
      )}

      {/* Top: text + CTA */}
      <div className="relative flex flex-col items-center px-6 pt-8 pb-4 text-center">
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </div>

        <h3 className="mt-2.5 line-clamp-2 min-h-[2.5em] text-lg font-bold leading-tight tracking-tight text-foreground">
          {product.name}
        </h3>

        <div className="mt-2 text-sm text-muted-foreground">
          {t("card.from")}{" "}
          <span className="font-semibold text-foreground">${product.priceFrom}</span>
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2 text-xs font-semibold text-brand-foreground transition-opacity group-hover:opacity-90">
          {t("card.view")}
          <span aria-hidden>→</span>
        </div>
      </div>

      {/* Bottom: multi-vial photo composition on pure white */}
      <ProductPhoto
        primary={product.image}
        alt={product.name}
        peptides={peptides}
        className="flex-1"
      />
    </Link>
  );
}
