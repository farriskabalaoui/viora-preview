import Link from "next/link";

export const metadata = { title: "Research Library & COAs" };

const articles = [
  {
    title: "BPC-157: A Survey of the Preclinical Literature",
    category: "Compound Profile",
    minutes: 7,
    excerpt:
      "An overview of the most-cited preclinical research on BPC-157 — tissue repair, angiogenesis, and gut-brain signaling.",
  },
  {
    title: "GHK-Cu in Skin & Tissue Research",
    category: "Compound Profile",
    minutes: 6,
    excerpt:
      "How GHK-Cu's copper-binding activity has shaped extracellular-matrix and dermatology research.",
  },
  {
    title: "Designing Reproducible Peptide Stack Protocols",
    category: "Methodology",
    minutes: 9,
    excerpt:
      "Why pre-blended stacks matter for reproducibility, and what to look for when choosing a research-grade supplier.",
  },
  {
    title: "Reading a Certificate of Analysis (COA)",
    category: "Quality",
    minutes: 5,
    excerpt:
      "A field guide to interpreting HPLC purity reports, mass-spec confirmation, and what 'research grade' actually means.",
  },
  {
    title: "GLP-3 / Retatrutide: What the Research Says",
    category: "Compound Profile",
    minutes: 8,
    excerpt:
      "A look at the multi-receptor mechanism behind one of the most-studied next-gen metabolic peptides.",
  },
  {
    title: "Cold Chain & Reconstitution: Best Practices",
    category: "Methodology",
    minutes: 6,
    excerpt:
      "Temperature handling, reconstitution math, and storage protocols for lyophilized peptides.",
  },
];

export default function ResearchPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-xs font-medium uppercase tracking-wider text-brand">
            Research Library
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Compound profiles, methodology,
            <br className="hidden sm:block" /> and lab-testing transparency.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Educational content for researchers — peptide profiles, protocol design,
            and Viora's published COAs.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Articles</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <article
              key={a.title}
              className="group flex flex-col rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-medium text-brand">
                  {a.category}
                </span>
                <span className="text-muted-foreground">{a.minutes} min read</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground group-hover:text-brand">
                {a.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {a.excerpt}
              </p>
              <div className="mt-4 text-sm font-medium text-brand">
                Read article →
              </div>
            </article>
          ))}
        </div>
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
            Every Viora batch is independently tested. COAs are publicly available — no
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
            Researchers can request the exact lot COA for any compound they've ordered
            via the client portal.
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
