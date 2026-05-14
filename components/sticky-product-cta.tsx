"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";

/**
 * Sticky CARD at the bottom of product detail pages — Direct-Peptides
 * style. Appears once the user scrolls past the primary buy-box.
 *
 * Layout (top to bottom):
 *   [Single Vial] [Pack of 10]                     [10mg] [20mg]
 *   BPC-157 + TB-500
 *   Order Now, Ships Today
 *   ─────────────────────────────────────────────────────────────
 *   [           Add To Cart  |  $99.00              ]
 *
 * Wire-up: the product detail page renders an invisible
 * <div id="primary-buybox-anchor" /> next to its main Add To Cart.
 * IntersectionObserver watches that anchor — when it scrolls out of
 * view (user is past the primary CTA), the sticky card fades in.
 * Re-entering the viewport hides it.
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
        setVisible(!entry.isIntersecting);
      },
      {
        rootMargin: "-50px 0px 0px 0px",
        threshold: 0,
      },
    );
    observer.observe(trigger);
    return () => observer.disconnect();
  }, [triggerSelector]);

  // Auto-clear the "Added" feedback after a moment
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
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6 sm:pb-6 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0"
      } transition-all duration-300 ease-out`}
    >
      <div
        className={`pointer-events-auto mx-auto max-w-3xl rounded-2xl bg-white p-5 shadow-[0_8px_32px_-4px_rgba(31,38,71,0.18),0_2px_4px_rgba(31,38,71,0.06)] ring-1 ring-black/[0.06] sm:p-6 ${
          visible ? "" : "pointer-events-none"
        }`}
      >
        {/* Top row: pill badges (left) + dose toggles (right) */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-brand-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand ring-1 ring-brand/20">
              Single Vial
            </span>
            <span className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ring-1 ring-border">
              Pack of 1
            </span>
          </div>

          {sizes && sizes.length > 1 && (
            <div className="flex items-center gap-1.5">
              {sizes.map((s) => (
                <button
                  key={s.mg}
                  type="button"
                  onClick={() => setSelectedMg(s.mg)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                    selectedMg === s.mg
                      ? "border-brand bg-brand-soft text-brand ring-1 ring-brand/30"
                      : "border-border bg-background text-foreground hover:border-brand/40"
                  }`}
                >
                  {s.mg}mg
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product name + subline */}
        <div className="mt-3">
          <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {name}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Order Now, Ships Today
          </p>
        </div>

        {/* Full-width Add to Cart + price button */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={!!outOfStock}
          className={`mt-4 flex w-full items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold transition sm:text-base ${
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
                ? "Added to cart ✓"
                : "Add To Cart"}
          </span>
          {!outOfStock && !added && (
            <>
              <span className="opacity-50">|</span>
              <span>${selectedPrice}.00</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
