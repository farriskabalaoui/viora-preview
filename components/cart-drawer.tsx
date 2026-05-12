"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n-context";
import { useAuthState } from "@/lib/use-auth-state";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal, totalItems } = useCart();
  const { t } = useI18n();
  const authState = useAuthState();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  /**
   * Kicks off a ClickBrick hosted-checkout session and redirects the
   * browser to their payment page. The current cart items are POSTed
   * server-side where the amount is recalculated (never trust client
   * totals for payment).
   *
   * Requires the user to be signed in — the auth check happens both
   * here (to fail fast) and in the API route (the real enforcement).
   */
  async function handleCheckout() {
    if (authState !== "in") {
      // Send unauthenticated users to login with a returnTo back to cart
      window.location.href = "/login?returnTo=/cart";
      return;
    }
    if (items.length === 0) return;

    setCheckingOut(true);
    setCheckoutError(null);

    try {
      const res = await fetch("/api/checkout/clickbrick/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            slug: i.slug,
            name: i.name,
            priceFrom: i.priceFrom,
            qty: i.qty,
          })),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        paymentURL?: string;
        error?: string;
      };
      if (!res.ok || !body.paymentURL) {
        setCheckoutError(body.error ?? "Checkout failed — please try again");
        setCheckingOut(false);
        return;
      }
      // Redirect to ClickBrick's hosted checkout page
      window.location.href = body.paymentURL;
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "Network error — try again",
      );
      setCheckingOut(false);
    }
  }

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <button
        onClick={() => setOpen(false)}
        aria-label="Close cart"
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
      />
      {/* Drawer */}
      <aside
        role="dialog"
        aria-label={t("cart.title")}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{t("cart.title")}</h2>
            <p className="text-xs text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">{t("cart.empty")}</p>
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-brand-foreground hover:opacity-90"
            >
              {t("cart.empty_cta")}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="divide-y divide-border">
                {items.map((it) => (
                  <li key={it.slug} className="flex gap-4 py-4">
                    <div className="relative h-16 w-16 flex-none overflow-hidden rounded-xl bg-muted/40">
                      <Image
                        src={it.image ?? `/products/${it.slug}.webp`}
                        alt={it.name}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/products/${it.slug}`}
                        onClick={() => setOpen(false)}
                        className="text-sm font-semibold text-foreground hover:text-brand"
                      >
                        {it.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        ${it.priceFrom} / unit
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => setQty(it.slug, it.qty - 1)}
                          aria-label={t("cart.qty_minus")}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-brand hover:text-brand"
                        >
                          –
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold">
                          {it.qty}
                        </span>
                        <button
                          onClick={() => setQty(it.slug, it.qty + 1)}
                          aria-label={t("cart.qty_plus")}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-brand hover:text-brand"
                        >
                          +
                        </button>
                        <button
                          onClick={() => remove(it.slug)}
                          className="ml-auto text-xs text-muted-foreground transition-colors hover:text-rose-600"
                        >
                          {t("cart.remove")}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm font-semibold text-foreground">
                        ${(it.priceFrom * it.qty).toFixed(0)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-border bg-muted/40 px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("cart.subtotal")}
                </span>
                <span className="text-lg font-semibold text-foreground">
                  ${subtotal.toFixed(0)}
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                Secure checkout via ClickBrick. Cards, eDebit, and ACH accepted. Payment is processed on the gateway&apos;s secure domain — Viora never sees your card details.
              </p>
              {checkoutError && (
                <div className="mt-3 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">
                  {checkoutError}
                </div>
              )}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={checkingOut || items.length === 0}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkingOut ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Redirecting to secure checkout…
                  </>
                ) : authState === "out" ? (
                  "Sign in to checkout →"
                ) : (
                  <>Pay ${subtotal.toFixed(2)} →</>
                )}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="mt-2 w-full rounded-full border border-border bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                {t("cart.continue")}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
