"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n-context";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal, totalItems } = useCart();
  const { t } = useI18n();

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
                        src={`/products/${it.slug}.webp`}
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
                {t("cart.note")}
              </p>
              <Link
                href="/contact?topic=Quote%20request"
                onClick={() => setOpen(false)}
                className="mt-4 flex w-full items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
              >
                {t("cart.checkout")}
              </Link>
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
