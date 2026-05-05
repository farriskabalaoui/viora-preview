"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const nav = [
  { href: "/products", label: "Research Compounds" },
  { href: "/products?category=Stack", label: "Stacks" },
  { href: "/research", label: "Research Library" },
  { href: "/about", label: "About" },
  { href: "/affiliate", label: "Affiliate" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-brand text-brand-foreground text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          <span>Now accepting research applications · Orders ship June 1, 2026</span>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <Image
              src="/viora-logo.webp"
              alt="Viora Healthcare"
              width={140}
              height={40}
              className="h-9 w-auto"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-foreground/75 transition-colors hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="hidden text-sm text-foreground/75 transition-colors hover:text-brand sm:block lg:inline-block"
            >
              Sign in
            </Link>
            <Link
              href="/products"
              className="hidden rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 sm:inline-block"
            >
              Shop Compounds
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
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-2 py-4">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full border border-border px-4 py-2 text-center text-sm font-medium text-foreground hover:border-brand hover:text-brand"
                >
                  Sign in
                </Link>
                <Link
                  href="/products"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full bg-brand px-4 py-2 text-center text-sm font-medium text-brand-foreground"
                >
                  Shop
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
