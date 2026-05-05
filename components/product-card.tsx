"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { STACK_PEPTIDES, BLEND_PEPTIDES } from "@/lib/products";
import { ProductPhoto } from "@/components/product-photo";
import { stockStatusFor } from "@/lib/stock";
import { useI18n } from "@/lib/i18n-context";

export function ProductCard({ product }: { product: Product }) {
  const stock = stockStatusFor(product.slug);
  const { t } = useI18n();

  const peptides =
    product.peptides ??
    STACK_PEPTIDES[product.slug] ??
    BLEND_PEPTIDES[product.slug];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex h-[480px] flex-col overflow-hidden rounded-2xl border border-border bg-muted/60 transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        backgroundImage: "radial-gradient(#dbe2ec 0.8px, transparent 0.8px)",
        backgroundSize: "14px 14px",
        backgroundColor: "#f4f6f8",
      }}
    >
      {/* Top: text + CTA */}
      <div className="relative flex flex-col items-center px-6 pt-7 pb-4 text-center">
        {product.category === "Blend" && (
          <span className="absolute left-4 top-4 rounded-full bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand">
            Blend
          </span>
        )}
        {product.category === "Stack" && (
          <span className="absolute left-4 top-4 rounded-full bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand">
            Stack
          </span>
        )}
        {stock !== "in_stock" && (
          <span
            className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
              stock === "low_stock"
                ? "bg-amber-100 text-amber-900"
                : "bg-rose-100 text-rose-900"
            }`}
          >
            {stock === "low_stock" ? t("product.low_stock") : t("product.out_of_stock")}
          </span>
        )}

        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {product.tags?.[0] ?? product.category}
        </div>

        <h3 className="mt-2 line-clamp-2 min-h-[2.5em] text-lg font-bold leading-tight tracking-tight text-foreground">
          {product.name}
        </h3>

        <div className="mt-1 text-sm text-muted-foreground">
          {t("card.from")}{" "}
          <span className="font-semibold text-foreground">${product.priceFrom}</span>
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2 text-xs font-semibold text-brand-foreground transition-opacity group-hover:opacity-90">
          {t("card.view")}
          <span aria-hidden>→</span>
        </div>
      </div>

      {/* Bottom: clean multi-vial photo composition */}
      <ProductPhoto
        primary={product.image}
        alt={product.name}
        peptides={peptides}
        className="flex-1"
      />
    </Link>
  );
}
