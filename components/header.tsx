"use client";

import Image from "next/image";
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
  { href: "/faq", key: "nav.faq" },
  { href: "/about", key: "nav.about" },
  { href: "/affiliate", key: "nav.affiliate" },
  { href: "/contact", key: "nav.contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();
  if (pathname?.startsWith("/growth")) return null;
  if (pathname?.startsWith("/polaris")) return null;

  return (
    <>
      {/* Top contact bar (DP-style) */}
      <div className="bg-muted/60 text-foreground/85 text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center">
          <span>{t("contact.help")}</span>
          <a
            href="tel:+19549951406"
            className="font-semibold text-brand transition-opacity hover:opacity-80"
          >
            +1 (954) 995-1406
          </a>
        </div>
      </div>

      {/* Brand + Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <Image
              src="/viora-logo-horizontal-tight-transparent.png"
              alt="Viora Healthcare"
              width={1080}
              height={360}
              priority
              className="h-10 w-auto"
            />
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
              href="/login"
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
                  href="/login"
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
