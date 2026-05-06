"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const cols = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All Compounds" },
      { href: "/products?category=Stack", label: "Stacks" },
      { href: "/products?category=Blend", label: "Blends" },
      { href: "/products?tag=Recovery", label: "Recovery" },
      { href: "/products?tag=Anti-Aging", label: "Anti-Aging" },
      { href: "/products?tag=Weight+Loss", label: "Weight Loss" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/research", label: "Research Library" },
      { href: "/research#coa", label: "Lab Testing & COAs" },
      { href: "/affiliate", label: "Affiliate Program" },
      { href: "/about", label: "About Viora" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/policies/shipping", label: "Shipping Policy" },
      { href: "/policies/returns", label: "Returns Policy" },
      { href: "/policies/privacy", label: "Privacy Policy" },
      { href: "/policies/terms", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/growth")) return null;

  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <svg viewBox="0 0 64 64" className="h-10 w-10" fill="none" aria-hidden="true">
                <rect x="5.5" y="5.5" width="53" height="53" rx="11" stroke="#284C3E" strokeWidth="3.5" fill="white" />
                <path d="M15 17 L23 17 L32 39 L41 17 L43 17 L43 50 L37 50 L37 28 L34 35 L30 35 L20 17 Z" fill="#284C3E" />
                <path d="M44 12 Q52 13 52 22 Q52 26 49 28 Q45 28 43 24 Q42 17 44 12 Z" fill="#284C3E" />
              </svg>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-extrabold tracking-tight text-brand">VIORA</span>
                <span className="mt-0.5 font-display text-[9px] font-medium uppercase tracking-[0.28em] text-brand/80">
                  Health Care
                </span>
              </div>
              <span className="sr-only">Viora Healthcare</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Lab-tested research peptides, third-party verified, physician-backed,
              manufactured & packed in the United States.
            </p>
            <form
              className="mt-6 flex max-w-sm gap-2"
              action="/api/contact"
              method="post"
            >
              <input type="hidden" name="topic" value="newsletter" />
              <input
                type="email"
                name="email"
                required
                placeholder="you@lab.org"
                className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand"
              />
              <button
                type="submit"
                className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
              >
                Join
              </button>
            </form>
          </div>
          {cols.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-muted-foreground transition-colors hover:text-brand"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
              Connect
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="https://instagram.com/viorahealthcare"
                  className="text-muted-foreground transition-colors hover:text-brand"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com/@viorahealthcare"
                  className="text-muted-foreground transition-colors hover:text-brand"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/viorahealthcare"
                  className="text-muted-foreground transition-colors hover:text-brand"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>© 2026 Viora Health Care. All rights reserved.</div>
          <div className="max-w-2xl text-[11px] leading-relaxed">
            <strong className="text-foreground/80">For research use only.</strong> All
            products are intended for in-vitro research and laboratory experimentation.
            Not for human consumption, diagnostic, or therapeutic use. Customers must
            be 21+ and acknowledge all compliance requirements. Manufactured & packed
            in the United States.
          </div>
        </div>
      </div>
    </footer>
  );
}
