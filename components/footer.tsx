"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  VIORA_EMAIL,
  VIORA_EMAIL_HREF,
  VIORA_PHONE_DISPLAY,
  VIORA_PHONE_HREF,
} from "@/lib/contact";

// Simplified per Marvin's direction (2026-05-12): cut 4 cols x 6 links each
// down to 2 narrow cols. Less is more. Brand + newsletter on the left,
// minimum-viable Shop and Company link sets, contact line at the bottom.
const SHOP_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/products?category=Stack", label: "Stacks" },
  { href: "/research", label: "Research" },
  { href: "/affiliate", label: "Affiliate" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/policies/terms", label: "Terms" },
  { href: "/policies/privacy", label: "Privacy" },
  { href: "/policies/shipping", label: "Shipping" },
  { href: "/policies/returns", label: "Returns" },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/growth")) return null;
  if (pathname?.startsWith("/polaris")) return null;

  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/viora-logo-horizontal-tight-transparent.png"
                alt="Viora Healthcare"
                width={1080}
                height={360}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Lab-tested research peptides, manufactured &amp; packed in the United States.
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

          {/* Shop */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
              Shop
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SHOP_LINKS.map((l) => (
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

          {/* Company */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
              Company
            </h4>
            <ul className="mt-4 grid grid-cols-2 gap-y-2.5 text-sm">
              {COMPANY_LINKS.map((l) => (
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

            <div className="mt-6 space-y-1.5 text-sm">
              <a
                href={VIORA_PHONE_HREF}
                className="block text-foreground transition-colors hover:text-brand"
              >
                {VIORA_PHONE_DISPLAY}
              </a>
              <a
                href={VIORA_EMAIL_HREF}
                className="block text-muted-foreground transition-colors hover:text-brand"
              >
                {VIORA_EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>© 2026 Viora Health Care. All rights reserved.</div>
          <div className="max-w-2xl text-[11px] leading-relaxed">
            <strong className="text-foreground/80">For laboratory research only.</strong>{" "}
            Not for human or animal consumption, diagnostic, or therapeutic use.
            Researchers must be 21+. Manufactured &amp; packed in the United States.
          </div>
        </div>
      </div>
    </footer>
  );
}
