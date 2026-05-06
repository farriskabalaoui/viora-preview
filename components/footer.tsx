"use client";

import Image from "next/image";
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
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/viora-logo-horizontal-tight.png"
                alt="Viora Healthcare"
                width={1080}
                height={360}
                className="h-12 w-auto"
              />
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
