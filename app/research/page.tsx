import Link from "next/link";
import {
  articles,
  categories,
  articleHeroImage,
  articleHeroPeptides,
} from "@/lib/articles";
import { ProductPhoto } from "@/components/product-photo";

export const metadata = { title: "Research Library & COAs" };

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function ResearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const activeCategory = sp.category;

  const filtered = activeCategory
    ? articles.filter((a) => a.category === activeCategory)
    : articles;

  const featured = articles.filter((a) => a.featured);
  const featuredHero = featured[0];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-xs font-medium uppercase tracking-wider text-brand">
            Research Library
          </div>
          <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Compound profiles, methodology, and lab-testing transparency.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Educational content for researchers — peptide profiles, protocol design,
            and Viora's published COAs. All articles are sourced from the published
            research literature and cite real PubMed-indexed studies.
          </p>
        </div>
      </section>

      {/* Calculator CTA */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <Link
          href="/research/calculator"
          className="group flex flex-col items-center gap-4 rounded-3xl border border-brand bg-brand p-6 text-center text-brand-foreground transition-opacity hover:opacity-95 sm:flex-row sm:gap-8 sm:p-8 sm:text-left"
        >
          <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-white/10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="8" y1="6" x2="16" y2="6" />
              <line x1="16" y1="14" x2="16" y2="18" />
              <line x1="8" y1="10" x2="8" y2="10" />
              <line x1="12" y1="10" x2="12" y2="10" />
              <line x1="16" y1="10" x2="16" y2="10" />
              <line x1="8" y1="14" x2="8" y2="14" />
              <line x1="12" y1="14" x2="12" y2="14" />
              <line x1="8" y1="18" x2="8" y2="18" />
              <line x1="12" y1="18" x2="12" y2="18" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium uppercase tracking-wider text-brand-foreground/70">
              Lab Tool
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Peptide Reconstitution Calculator
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-foreground/85 sm:text-base">
              Calculate vial concentration and exact volume to draw — instant
              results, supports U30/U50/U100 syringes, with quick-pick presets for
              common Viora compounds.
            </p>
          </div>
          <div className="flex-none rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand transition-transform group-hover:translate-x-0.5">
            Open calculator →
          </div>
        </Link>
      </section>

      {/* Featured */}
      {featuredHero && !activeCategory && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Link
            href={`/research/${featuredHero.slug}`}
            className="group grid grid-cols-1 gap-8 overflow-hidden rounded-3xl border border-border bg-[#f4f6f8] transition-all hover:border-brand/40 hover:shadow-lg lg:grid-cols-12"
          >
            <div
              className="relative aspect-[4/3] overflow-hidden lg:col-span-6 lg:aspect-auto lg:min-h-[360px]"
              style={{ backgroundColor: "#f4f6f8" }}
            >
              <span className="absolute left-5 top-5 z-20 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-foreground">
                Featured
              </span>
              <ProductPhoto
                primary={articleHeroImage(featuredHero)}
                alt={featuredHero.title}
                peptides={articleHeroPeptides(featuredHero) ?? undefined}
                className="h-full"
              />
            </div>
            <div className="flex flex-col justify-center px-8 pb-10 lg:col-span-6 lg:px-12 lg:py-12">
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded-full bg-brand-soft px-2.5 py-1 font-semibold text-brand">
                  {featuredHero.category}
                </span>
                <span className="text-muted-foreground">
                  {featuredHero.readMinutes} min read
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground group-hover:text-brand sm:text-4xl">
                {featuredHero.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {featuredHero.excerpt}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                Read article →
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Filters + grid */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            All articles
          </h2>
          <div className="flex flex-wrap gap-2">
            <FilterChip href="/research" active={!activeCategory}>
              All
            </FilterChip>
            {categories.map((c) => (
              <FilterChip
                key={c}
                href={`/research?category=${encodeURIComponent(c)}`}
                active={activeCategory === c}
              >
                {c}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <Link
              key={a.slug}
              href={`/research/${a.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
            >
              <div
                className="relative aspect-[16/10] overflow-hidden"
                style={{ backgroundColor: "#f4f6f8" }}
              >
                <ProductPhoto
                  primary={articleHeroImage(a)}
                  alt={a.title}
                  peptides={articleHeroPeptides(a) ?? undefined}
                  className="h-full"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-semibold text-brand">
                      {a.category}
                    </span>
                    {a.inProgress && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 font-semibold text-amber-900">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-600" />
                        </span>
                        Study in progress
                      </span>
                    )}
                  </div>
                  <span className="whitespace-nowrap text-muted-foreground">{a.readMinutes} min read</span>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-snug text-foreground group-hover:text-brand">
                  {a.title}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {a.excerpt}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
                  Read article
                  <span aria-hidden>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            No articles match this filter yet.
          </div>
        )}
      </section>

      {/* COAs */}
      <section id="coa" className="border-t border-border bg-muted/30 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-xs font-medium uppercase tracking-wider text-brand">
            Lab Testing & COAs
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Published purity reports.
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Every Viora batch is independently tested by accredited third-party labs
            using HPLC and mass spectrometry. COAs are publicly available — no
            account required.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Tesamorelin", file: "/coas/Tesamorelin-purity.pdf", batch: "VHC-2649801" },
              { name: "MOTS-c", file: "/coas/MOTS-c-purity.pdf", batch: "VHC-7934158" },
              { name: "GHK-Cu", file: "/coas/GHK-Cu-purity.pdf", batch: "VHC-6183274" },
              { name: "Retatrutide", file: "/coas/Retatrutide-purity.pdf", batch: "VHC-1058642" },
            ].map((coa) => (
              <a
                key={coa.name}
                href={coa.file}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-border bg-background p-6 transition-all hover:border-brand hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-foreground group-hover:text-brand">
                  {coa.name}
                </h3>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {coa.batch}
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand">
                  Open PDF
                  <span aria-hidden>↗</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center sm:px-6">
          <h3 className="text-3xl font-semibold tracking-tight">
            Need a COA for a specific batch?
          </h3>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Researchers can request the exact lot COA for any compound they've
            ordered via the client portal.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
          >
            Request a COA
          </Link>
        </div>
      </section>
    </>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-brand bg-brand text-brand-foreground"
          : "border-border bg-background text-muted-foreground hover:border-brand/50 hover:text-brand"
      }`}
    >
      {children}
    </Link>
  );
}
