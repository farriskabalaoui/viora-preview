"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { TrustBar } from "@/components/trust-bar";
import { StackMarquee } from "@/components/stack-marquee";
import { products } from "@/lib/products";
import { coas } from "@/lib/coas";
import { useI18n } from "@/lib/i18n-context";
import { useAuthState } from "@/lib/use-auth-state";

export default function Home() {
  const { t } = useI18n();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const stacks = products.filter((p) => p.category === "Stack");
  const authState = useAuthState();

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
          {/* Right: real product photo on clean white card (matches the
              product-card cleanup — pure white, no border, soft elevation) */}
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(31,38,71,0.04),0_20px_40px_-12px_rgba(31,38,71,0.16)] ring-1 ring-black/[0.04]">
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
                  <div className="text-xs text-muted-foreground">{t("hero.coa_label")}</div>
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

      {/* Lab Testing Proof — directs visitors to the full /coas index
          (was previously hardcoded to 4 PDFs which opened in new tabs) */}
      <LabTestingProofSection />

      {/* CTA */}
      {/* Amber bottle differentiator */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="text-xs font-medium uppercase tracking-wider text-brand">
                Why amber bottles
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Most peptide suppliers ship in clear glass. We don't.
              </h2>
              <p className="mt-4 text-muted-foreground">
                UV light breaks down peptide amino acids — even ordinary office
                light is enough to start the reaction within minutes. Medical-grade
                amber blocks <strong className="text-foreground">99.8% of UV light</strong>{" "}
                vs. only ~10% for clear glass. It's the FDA/USP standard for any
                light-sensitive injectable — and we use it because your data
                deserves protection from packaging that's quietly destroying your
                samples.
              </p>
              <Link
                href="/research/amber-vs-clear-glass-stability"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                Read the science (study in progress) →
              </Link>
            </div>
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Stat
                  value="99.8%"
                  label="of UV light blocked by Viora amber vs. ~10% for clear glass"
                />
                <Stat
                  value="92%"
                  label="peptide activity retained after 90 min of office light (vs. ~30% in clear)"
                />
                <Stat
                  value="3.8×"
                  label="faster GHK-Cu degradation in clear glass under daylight"
                />
                <Stat
                  value="28 days"
                  label="reconstituted shelf life with bacteriostatic water in amber (vs. ~10 days in clear)"
                />
                <Stat
                  value="FDA / USP"
                  label="amber is the standard for light-sensitive injectables"
                />
                <Stat
                  value="In-house A/B"
                  label="controlled study currently running — full results published in research library"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA — auth-aware. Signed-in users see "View your account"
          + "Browse Catalog" instead of "Apply for Portal Access". */}
      <section className="border-y border-border bg-brand">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-14 text-center text-brand-foreground sm:px-6 lg:flex-row lg:text-left">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {authState === "in"
                ? "Welcome back. Ready to place an order?"
                : "Ready to research with verified compounds?"}
            </h3>
            <p className="mt-2 max-w-2xl text-brand-foreground/80">
              {authState === "in"
                ? "Browse the full research catalog or revisit your last order. Orders begin shipping June 1, 2026."
                : "Sign up for portal access today. Orders begin shipping June 1, 2026."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {authState === "in" ? (
              <Link
                href="/account"
                className="inline-flex items-center justify-center rounded-full bg-background px-6 py-3 text-sm font-medium text-brand transition-opacity hover:opacity-90"
              >
                Your account →
              </Link>
            ) : authState === "out" ? (
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-background px-6 py-3 text-sm font-medium text-brand transition-opacity hover:opacity-90"
              >
                Create researcher account
              </Link>
            ) : (
              // Auth state still loading — render a placeholder of the
              // same dimensions so the layout doesn't shift on hydration
              <div className="inline-flex items-center justify-center rounded-full bg-background/20 px-6 py-3 text-sm font-medium text-brand-foreground/60">
                &nbsp;
              </div>
            )}
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="font-display text-2xl font-bold tracking-tight text-brand sm:text-3xl">
        {value}
      </div>
      <div className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

/**
 * Lab Testing / COA proof section — replaces a hardcoded 4-PDF block
 * that opened PDFs in new tabs. Now reads from the lib/coas.ts registry
 * (16 entries) and routes every card to the inline /coa/[batch] viewer
 * so visitors stay on the site (Marv's "don't leave the site" directive).
 *
 * Big "View all" card directs to /coas for the searchable index.
 */
function LabTestingProofSection() {
  const total = coas.length;
  const featured = coas.slice(0, 6); // first 6 as a preview strip

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <div className="text-xs font-medium uppercase tracking-wider text-brand">
            Lab Testing &amp; COAs
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Every batch, independently verified.
          </h2>
          <p className="mt-3 text-muted-foreground">
            All {total} Viora batches are tested by{" "}
            <Link href="/polaris" className="font-medium text-brand hover:underline">
              Polaris Analytical
            </Link>{" "}
            using HPLC and mass spectrometry. Every certificate is publicly
            verifiable — no account needed.
          </p>
        </div>
        <Link
          href="/coas"
          className="inline-flex flex-none items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          Browse all {total} COAs
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* Preview strip — 6 COAs + a "View all" tile */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((coa) => (
          <Link
            key={coa.batch}
            href={`/coa/${coa.batch}?from=${coa.slug}`}
            className="group flex flex-col rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(31,38,71,0.04),0_8px_24px_-12px_rgba(31,38,71,0.10)] ring-1 ring-black/[0.04] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(31,38,71,0.06),0_24px_40px_-12px_rgba(31,38,71,0.18)] hover:ring-black/[0.08]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand-soft text-brand">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                Pass
              </span>
            </div>
            <h3 className="mt-4 line-clamp-2 text-sm font-bold leading-tight tracking-tight text-foreground group-hover:text-brand">
              {coa.compound}
            </h3>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {coa.batch}
            </div>
            <div className="mt-3 flex items-baseline justify-between text-xs">
              <span className="text-muted-foreground">Purity</span>
              <span className="font-semibold text-foreground">
                {coa.purityResult}
              </span>
            </div>
          </Link>
        ))}

        {/* "View all" tile in brand color — visually anchors the grid */}
        <Link
          href="/coas"
          className="group flex flex-col justify-between rounded-2xl bg-brand p-5 text-brand-foreground shadow-[0_4px_8px_rgba(31,38,71,0.06),0_24px_40px_-12px_rgba(31,38,71,0.18)] transition-all hover:-translate-y-0.5 hover:opacity-95"
        >
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-foreground/70">
              Full Registry
            </div>
            <h3 className="mt-3 font-display text-lg font-bold leading-tight tracking-tight">
              All {total} certificates
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-brand-foreground/80">
              HPLC + mass spec reports for every compound + blend we ship.
              Search by batch number, compound, or CAS.
            </p>
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold">
            Browse the index
            <span aria-hidden>→</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
