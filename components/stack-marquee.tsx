"use client";

import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

/**
 * Auto-scrolling stack carousel — DP-style continuous left-to-right motion.
 * Pauses on hover. Cards are duplicated for seamless loop.
 */
export function StackMarquee({
  products,
  speed = "slow",
}: {
  products: Product[];
  speed?: "normal" | "slow";
}) {
  const animClass = speed === "slow" ? "animate-marquee-slow" : "animate-marquee";
  const doubled = [...products, ...products];
  return (
    <div className="marquee-pause overflow-hidden py-2">
      <div className={`flex w-max gap-5 ${animClass}`}>
        {doubled.map((p, i) => (
          <div
            key={`${p.slug}-${i}`}
            className="w-[280px] flex-none sm:w-[320px]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
