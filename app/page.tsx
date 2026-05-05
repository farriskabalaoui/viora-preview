"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { TrustBar } from "@/components/trust-bar";
import { StackMarquee } from "@/components/stack-marquee";
import { products } from "@/lib/products";
import { useI18n } from "@/lib/i18n-context";

export default function Home() {
  const { t } = useI18n();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const stacks = products.filter((p) => p.category === "Stack");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-soft/40 via-background to-background" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {t("hero.pill")}
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t("hero.headline_1")}
              <br />
              <span className="text-brand">{t("hero.headline_2")}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t("hero.subheadline")}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
              >
                {t("hero.cta_shop")} →
              </Link>
              <Link
                href="/research#coa"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                {t("hero.cta_coa")}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {t("hero.purity")}
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {t("hero.physician")}
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {t("hero.us")}
              </div>
            </div>
          </div>
          {/* Right: real product photo on clean solid bg */}
          <div className="relative">
            <div
              className="relative aspect-square overflow-hidden rounded-3xl border border-border shadow-md"
              style={{ backgroundColor: "#f4f6f8" }}
            >
              <div
                className="relative h-full w-full"
                style={{
                  filter:
                    "drop-shadow(0 18px 24px rgba(31, 38, 71, 0.16)) drop-shadow(0 6px 8px rgba(31, 38, 71, 0.08))",
                }}
              >
                <Image
                  src="/products/bpc-157.webp"
                  alt="Viora research peptide vial"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-10"
                />
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-border bg-background p-4 shadow-lg sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-brand-foreground">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Latest COA</div>
                  <div className="text-sm font-semibold">Tesamorelin · ≥99%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* One carousel — mixed stacks, blends, and single peptides */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-10 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-brand">
                {t("catalog.eyebrow")}
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {t("catalog.title")}
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">{t("catalog.subtitle")}</p>
            </div>
            <Link href="/products" className="text-sm font-medium text-brand hover:underline">
              {t("catalog.cta")}
            </Link>
          </div>
        </div>
        <div className="-mt-2 pb-16">
          <StackMarquee
            products={(() => {
              // Interleave stacks + featured singles + remaining catalog so the
              // carousel feels diverse: stack, single, blend, stack, single, blend...
              const singles = featured.filter((p) => p.category === "Peptide");
              const blends = products.filter((p) => p.category === "Blend");
              const ordered: typeof stacks = [];
              const buckets = [stacks, singles, blends];
              const max = Math.max(stacks.length, singles.length, blends.length);
              for (let i = 0; i < max; i++) {
                for (const bucket of buckets) {
                  if (bucket[i]) ordered.push(bucket[i]);
                }
              }
              return ordered
                .filter((p, i, arr) => arr.findIndex((q) => q.slug === p.slug) === i)
                .slice(0, 14);
            })()}
            speed="slow"
          />
        </div>
      </section>

      {/* Lab Testing Proof */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-brand">
              Lab Testing & COAs
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Every batch, independently verified.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every Viora batch is independently tested by accredited third-party
              laboratories using HPLC and mass spectrometry. Certificates of Analysis
              are publicly available — no account needed.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { name: "Tesamorelin", file: "/coas/Tesamorelin-purity.pdf" },
                { name: "MOTS-C", file: "/coas/MOTS-c-purity.pdf" },
                { name: "GHK-Cu", file: "/coas/GHK-Cu-purity.pdf" },
                { name: "Retatrutide", file: "/coas/Retatrutide-purity.pdf" },
              ].map((coa) => (
                <a
                  key={coa.name}
                  href={coa.file}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 transition-colors hover:border-brand hover:bg-brand-soft"
                >
                  <div>
                    <div className="text-sm font-semibold text-foreground group-hover:text-brand">
                      {coa.name}
                    </div>
                    <div className="text-xs text-muted-foreground">Purity COA · PDF</div>
                  </div>
                  <span className="text-brand">↗</span>
                </a>
              ))}
            </div>
          </div>
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border"
            style={{ backgroundColor: "#f4f6f8" }}
          >
            <div
              className="relative h-full w-full"
              style={{
                filter:
                  "drop-shadow(0 16px 22px rgba(31, 38, 71, 0.16)) drop-shadow(0 4px 6px rgba(31, 38, 71, 0.08))",
              }}
            >
              <Image
                src="/products/tesamorelin.webp"
                alt="Lab-tested research peptide"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-10"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-end p-8">
              <div className="rounded-2xl border border-border bg-background/95 p-5 backdrop-blur">
                <div className="text-xs font-medium uppercase tracking-wider text-brand">
                  Quality Standard
                </div>
                <div className="mt-1 text-xl font-semibold text-foreground">
                  HPLC + Mass Spec on every batch.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-border bg-brand">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-14 text-center text-brand-foreground sm:px-6 lg:flex-row lg:text-left">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to research with verified compounds?
            </h3>
            <p className="mt-2 max-w-2xl text-brand-foreground/80">
              Apply for portal access today. Orders begin shipping June 1, 2026.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-background px-6 py-3 text-sm font-medium text-brand transition-opacity hover:opacity-90"
            >
              Apply for Portal Access
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-brand-foreground/30 px-6 py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-white/10"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
