import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "About Viora" };

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-soft/40 via-background to-background" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <div className="text-xs font-medium uppercase tracking-wider text-brand">
            About Viora
          </div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Built for researchers, backed by physicians.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Viora exists because research deserves better. We supply high-purity
            peptide compounds with verified COAs, transparent lab testing, and the
            quality control researchers need to trust their data — manufactured and
            packed in the United States.
          </p>
        </div>
      </section>

      {/* Mission + Story */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-brand">
              Our Mission
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              High-purity research peptides — without compromise.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every batch we ship has been independently verified to ≥99% purity by
              accredited third-party labs using HPLC and mass spectrometry. We publish
              the COAs publicly, because trust in research starts with transparency.
            </p>
            <p className="mt-4 text-muted-foreground">
              Our quality control standards are reviewed by licensed physicians and
              PhD chemists. Every peptide moves through documented chain-of-custody
              from synthesis to fulfillment — entirely within the United States.
            </p>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(31,38,71,0.04),0_20px_40px_-12px_rgba(31,38,71,0.14)] ring-1 ring-black/[0.04]">
            <div
              className="relative h-full w-full"
              style={{
                filter:
                  "drop-shadow(0 16px 22px rgba(31, 38, 71, 0.16)) drop-shadow(0 4px 6px rgba(31, 38, 71, 0.08))",
              }}
            >
              <Image
                src="/products/bpc-tb-500.webp"
                alt="Viora research peptide vials"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <div className="text-xs font-medium uppercase tracking-wider text-brand">
              How We're Different
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Four pillars of Viora research-grade.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Third-Party Tested",
                body:
                  "Every compound independently verified by accredited labs — HPLC and mass spectrometry on every batch.",
              },
              {
                title: "Physician-Backed",
                body:
                  "Sourcing and quality decisions reviewed by licensed physicians and PhD chemists.",
              },
              {
                title: "Made in the U.S.",
                body:
                  "Manufactured and packed in the United States — discreet, fast fulfillment from our U.S. facility.",
              },
              {
                title: "Enterprise-Grade Security",
                body:
                  "Bank-grade 256-bit encryption, audit-logged access controls, and research-use compliance baked into every order.",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <div className="h-2 w-8 rounded-full bg-brand" />
                <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-14 text-center text-brand-foreground sm:px-6 lg:flex-row lg:text-left">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Apply for portal access.
            </h3>
            <p className="mt-2 text-brand-foreground/80">
              Verified researchers and clinicians only. Orders begin shipping June 1, 2026.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-background px-6 py-3 text-sm font-medium text-brand transition-opacity hover:opacity-90"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </>
  );
}
