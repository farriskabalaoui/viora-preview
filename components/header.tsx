"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { LangToggle } from "@/components/lang-toggle";
import { CartButton } from "@/components/cart-button";
import { FeatureBar } from "@/components/feature-bar";
import type { DictKey } from "@/lib/i18n";

const nav: { href: string; key: DictKey }[] = [
  { href: "/products", key: "nav.research_compounds" },
  { href: "/products?category=Stack", key: "nav.stacks" },
  { href: "/research", key: "nav.research_library" },
  { href: "/about", key: "nav.about" },
  { href: "/affiliate", key: "nav.affiliate" },
  { href: "/contact", key: "nav.contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();
  if (pathname?.startsWith("/growth")) return null;

  return (
    <>
      {/* Top contact bar (DP-style) */}
      <div className="bg-muted/60 text-foreground/85 text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center">
          <span>{t("contact.help")}</span>
          <a
            href="tel:+13109996246"
            className="font-semibold text-brand transition-opacity hover:opacity-80"
          >
            +1 (310) 999-VIORA
          </a>
        </div>
      </div>

      {/* Brand + Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            {/* Brand-guide V mark: rounded frame + V + leaf accent */}
            <svg viewBox="0 0 64 64" className="h-9 w-9" fill="none" aria-hidden="true">
              <rect x="5.5" y="5.5" width="53" height="53" rx="11" stroke="#284C3E" strokeWidth="3.5" fill="white" />
              <path d="M15 17 L23 17 L32 39 L41 17 L43 17 L43 50 L37 50 L37 28 L34 35 L30 35 L20 17 Z" fill="#284C3E" />
              <path d="M44 12 Q52 13 52 22 Q52 26 49 28 Q45 28 43 24 Q42 17 44 12 Z" fill="#284C3E" />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="font-display text-[18px] font-extrabold tracking-tight text-brand">VIORA</span>
              <span className="mt-0.5 font-display text-[9px] font-medium uppercase tracking-[0.28em] text-brand/80">
                Health Care
              </span>
            </div>
            <span className="sr-only">Viora Healthcare</span>
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-foreground/75 transition-colors hover:text-brand"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LangToggle className="hidden sm:inline-flex" />
            <Link
              href="/contact"
              className="hidden text-sm text-foreground/75 transition-colors hover:text-brand lg:inline-block"
            >
              {t("nav.signin")}
            </Link>
            <CartButton />
            <Link
              href="/products"
              className="hidden rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 sm:inline-block"
            >
              {t("nav.shop")}
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:border-brand hover:text-brand lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {open ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-border bg-background lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-border py-3 text-base font-medium text-foreground last:border-b-0 hover:text-brand"
                >
                  {t(item.key)}
                </Link>
              ))}
              <div className="flex items-center gap-2 py-4">
                <LangToggle />
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full border border-border px-4 py-2 text-center text-sm font-medium text-foreground hover:border-brand hover:text-brand"
                >
                  {t("nav.signin")}
                </Link>
                <Link
                  href="/products"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full bg-brand px-4 py-2 text-center text-sm font-medium text-brand-foreground"
                >
                  {t("nav.shopShort")}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Auto-scrolling feature bar (dark blue) */}
      <FeatureBar />

      {/* Research-use disclaimer line */}
      <div className="bg-muted/40 border-b border-border text-foreground/70 text-[11px]">
        <div className="mx-auto max-w-7xl px-4 py-2 text-center sm:px-6">
          <span className="font-semibold text-foreground">{t("ruo.label")}</span>{" "}
          {t("ruo.body")}
        </div>
      </div>
    </>
  );
}
