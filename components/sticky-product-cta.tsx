"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";

/**
 * Sticky bottom bar on product detail pages — appears once the user
 * has scrolled past the main buy-box. Mirrors Direct Peptides' UX so
 * customers always have a one-click path to add without scrolling
 * back up.
 *
 * Shows:
 *   - thumbnail
 *   - product name + "Order Now, Ships Today" microcopy
 *   - dose / size selector buttons (when there are multiple)
 *   - "Add To Cart | $price" combined CTA
 *
 * Hides:
 *   - when out of stock (prevents add)
 *   - when the user is at the top of the page (would shadow the
 *     primary buy-box) — controlled via the `triggerRef` from the
 *     primary AddToCart on the page
 *
 * Wire-up: the product detail page renders an invisible
 * <div id="primary-buybox-anchor" /> next to its main Add To Cart,
 * and we observe it. When that anchor goes out of view (user scrolled
 * past it), we show the sticky bar.
 */
type Size = { mg: number; price: number };

export function StickyProductCTA({
  slug,
  name,
  priceFrom,
  image,
  sizes,
  outOfStock,
  triggerSelector = "#primary-buybox-anchor",
}: {
  slug: string;
  name: string;
  priceFrom: number;
  image: string;
  /** Optional dose variants — if present, renders pill toggles */
  sizes?: Size[];
  outOfStock?: boolean;
  /** CSS selector of the in-page element we hide behind */
  triggerSelector?: string;
}) {
  const { add } = useCart();
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track selected dose. Default to the first size (cheapest) or the
  // base priceFrom if no sizes.
  const [selectedMg, setSelectedMg] = useState<number | null>(
    sizes && sizes.length > 0 ? sizes[0].mg : null,
  );
  const selectedPrice = (() => {
    if (!sizes || sizes.length === 0) return priceFrom;
    const s = sizes.find((x) => x.mg === selectedMg);
    return s?.price ?? priceFrom;
  })();

  // Hide when the primary buy-box is in view; show when scrolled past.
  useEffect(() => {
    const trigger = document.querySelector(triggerSelector);
    if (!trigger) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show bar when trigger is OUT of viewport (scrolled past)
        setVisible(!entry.isIntersecting);
      },
      {
        // Trigger as soon as primary CTA scrolls above viewport
        rootMargin: "-50px 0px 0px 0px",
        threshold: 0,
      },
    );
    observer.observe(trigger);
    return () => observer.disconnect();
  }, [triggerSelector]);

  // Reset "added" flag after a few seconds
  useEffect(() => {
    if (!added) return;
    addedTimer.current = setTimeout(() => setAdded(false), 2400);
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, [added]);

  function handleAdd() {
    if (outOfStock) return;
    add({ slug, name, priceFrom: selectedPrice, image }, 1);
    setAdded(true);
  }

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6 sm:pb-5 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0"
      } transition-all duration-300 ease-out`}
    >
      <div
        className={`pointer-events-auto mx-auto flex max-w-3xl items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_8px_24px_-8px_rgba(31,38,71,0.18),0_2px_4px_rgba(31,38,71,0.06)] ring-1 ring-black/[0.06] sm:gap-4 sm:p-4 ${
          visible ? "" : "pointer-events-none"
        }`}
      >
        {/* Thumbnail */}
        <div className="relative h-12 w-12 flex-none overflow-hidden rounded-lg bg-white ring-1 ring-black/[0.04] sm:h-14 sm:w-14">
          <Image
            src={image}
            alt={name}
            fill
            sizes="56px"
            className="object-contain p-1"
          />
        </div>

        {/* Name + subline */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="inline-flex items-center rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
              Single Vial
            </span>
          </div>
          <div className="mt-1 truncate text-sm font-bold tracking-tight text-foreground sm:text-base">
            {name}
          </div>
          <div className="hidden text-xs text-muted-foreground sm:block">
            Order Now, Ships Today
          </div>
        </div>

        {/* Dose toggles (only if multiple sizes) */}
        {sizes && sizes.length > 1 && (
          <div className="hidden items-center gap-1 md:flex">
            {sizes.map((s) => (
              <button
                key={s.mg}
                type="button"
                onClick={() => setSelectedMg(s.mg)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  selectedMg === s.mg
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-border bg-background text-foreground hover:border-brand/40"
                }`}
              >
                {s.mg}mg
              </button>
            ))}
          </div>
        )}

        {/* Combined Add to cart + price button */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={!!outOfStock}
          className={`flex flex-none items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition sm:px-5 sm:py-3 ${
            outOfStock
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : added
                ? "bg-emerald-600 text-white"
                : "bg-brand text-brand-foreground hover:opacity-90"
          }`}
        >
          <span>
            {outOfStock
              ? "Out of stock"
              : added
                ? "Added ✓"
                : "Add To Cart"}
          </span>
          {!outOfStock && !added && (
            <>
              <span className="opacity-50">|</span>
              <span>${selectedPrice}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
