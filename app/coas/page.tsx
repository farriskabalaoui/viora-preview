"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { coas, type CoaRecord } from "@/lib/coas";

/**
 * Public COA index. Lists every certificate we've issued via Polaris
 * Analytical with a client-side search box (filters by batch number,
 * compound name, or CAS).
 *
 * Each card links to the inline viewer at /coa/<batch> (keeps the
 * visitor on viorahealthcare.com).
 *
 * Note: Polaris's own /polaris page intentionally stays "search-only,
 * no browse" per Marv's spec — that's for outside lab clients who
 * shouldn't see a directory. This Viora-side page is the public
 * directory for our customers.
 */
export default function CoasIndexPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return coas;
    const q = query.toLowerCase().trim();
    return coas.filter(
      (c) =>
        c.batch.toLowerCase().includes(q) ||
        c.compound.toLowerCase().includes(q) ||
        c.cas.toLowerCase().includes(q) ||
        c.slug.includes(q),
    );
  }, [query]);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="text-xs font-medium uppercase tracking-wider text-brand">
            Lab Testing
          </div>
          <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Certificates of Analysis
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Every Viora batch is independently tested by{" "}
            <Link
              href="/polaris"
              className="font-medium text-brand hover:underline"
            >
              Polaris Analytical
            </Link>{" "}
            using HPLC and mass spectrometry. Browse, search by batch
            number, or verify a specific lot.
          </p>
        </div>
      </section>

      {/* Search + count */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by batch (VHC-...) or compound name"
              className="w-full rounded-full border border-border bg-background py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
            of {coas.length} certificates
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <div className="text-sm font-medium text-foreground">No certificates match that search.</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a partial batch number (e.g. <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">VHC-264</code>)
              or compound name.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((coa) => (
              <CoaCard key={coa.batch} coa={coa} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-14 text-center sm:px-6">
          <div className="text-xs font-medium uppercase tracking-wider text-brand">
            Independent Verification
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Verify a specific batch on Polaris
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Want to confirm a COA you received with a vial? Enter the batch
            number directly on the Polaris Analytical site — independent of
            Viora.
          </p>
          <Link
            href="/polaris"
            className="mt-6 inline-flex items-center rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
          >
            Verify on Polaris →
          </Link>
        </div>
      </section>
    </>
  );
}

function CoaCard({ coa }: { coa: CoaRecord }) {
  return (
    <Link
      href={`/coa/${coa.batch}?from=${coa.slug}`}
      className="group flex flex-col rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(31,38,71,0.04),0_8px_24px_-12px_rgba(31,38,71,0.10)] ring-1 ring-black/[0.04] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(31,38,71,0.06),0_24px_40px_-12px_rgba(31,38,71,0.18)] hover:ring-black/[0.08]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-brand-soft text-brand">
          <svg
            width="20"
            height="20"
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
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Pass
        </span>
      </div>

      <h3 className="mt-4 line-clamp-2 text-base font-bold leading-tight tracking-tight text-foreground group-hover:text-brand">
        {coa.compound}
      </h3>

      <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {coa.batch}
      </div>

      <dl className="mt-4 space-y-1.5 text-xs text-foreground/75">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Purity</dt>
          <dd className="font-semibold text-foreground">{coa.purityResult}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Analyzed</dt>
          <dd>{coa.analysisDate}</dd>
        </div>
      </dl>

      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
        View certificate
        <span aria-hidden>→</span>
      </div>
    </Link>
  );
}
