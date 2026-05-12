import type { ProductResearch } from "@/lib/product-research";

/**
 * Renders the per-product research dossier (Overview, History, Structures,
 * Research Findings, Key Areas, References) below the buy-box.
 *
 * Modeled on the Direct Peptides product-page layout that Marvin called out
 * as the reference. Keeps every claim in research/preclinical framing —
 * never therapeutic, never medical.
 */
export function ProductResearchSection({
  data,
  productName,
}: {
  data: ProductResearch;
  productName: string;
}) {
  return (
    <section className="mt-20 border-t border-border pt-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left column: scrollable nav-like outline (visible on lg+) */}
        <aside className="hidden lg:col-span-3 lg:block">
          <nav className="sticky top-24">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand">
              On this page
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#overview" className="text-muted-foreground hover:text-brand">Overview</a></li>
              <li><a href="#history" className="text-muted-foreground hover:text-brand">History</a></li>
              <li><a href="#structure" className="text-muted-foreground hover:text-brand">Structure</a></li>
              <li><a href="#findings" className="text-muted-foreground hover:text-brand">Research findings</a></li>
              <li><a href="#references" className="text-muted-foreground hover:text-brand">References</a></li>
            </ul>
          </nav>
        </aside>

        {/* Right column: content */}
        <div className="lg:col-span-9">
          {/* Overview */}
          <div id="overview">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {productName} Overview
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/85">
              {data.overview}
            </p>
          </div>

          {/* History */}
          <div id="history" className="mt-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              History
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/85">
              {data.history}
            </p>
          </div>

          {/* Structures */}
          <div id="structure" className="mt-12 space-y-8">
            {data.structures.map((s) => (
              <div key={s.name}>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {s.name} Structure
                </h2>
                <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-2 rounded-2xl border border-border bg-muted/30 p-5 text-sm sm:grid-cols-2">
                  <div className="flex items-baseline gap-2">
                    <dt className="font-semibold text-foreground">CAS #:</dt>
                    <dd className="text-foreground/80">{s.cas}</dd>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <dt className="font-semibold text-foreground">Molecular Formula:</dt>
                    <dd className="text-foreground/80">{s.molecularFormula}</dd>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <dt className="font-semibold text-foreground">Molecular Weight:</dt>
                    <dd className="text-foreground/80">{s.molecularWeight}</dd>
                  </div>
                  {s.pubchemId && (
                    <div className="flex items-baseline gap-2">
                      <dt className="font-semibold text-foreground">PubChem ID:</dt>
                      <dd className="text-foreground/80">
                        <a
                          href={`https://pubchem.ncbi.nlm.nih.gov/compound/${s.pubchemId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand hover:underline"
                        >
                          {s.pubchemId}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            ))}
          </div>

          {/* Research Findings */}
          <div id="findings" className="mt-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Research Findings
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/85">
              {data.researchFindings}
            </p>

            <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-5">
              <div className="text-sm font-semibold text-foreground">Key Areas of Research</div>
              <ul className="mt-3 space-y-2 text-sm text-foreground/85">
                {data.keyAreas.map((area) => {
                  const [head, ...rest] = area.split(":");
                  const tail = rest.join(":").trim();
                  return (
                    <li key={area} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                      <span>
                        <span className="font-medium text-foreground">{head}:</span>{" "}
                        {tail}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="mt-6 text-base leading-relaxed text-foreground/85">
              {data.closingSummary}
            </p>
          </div>

          {/* References */}
          <div id="references" className="mt-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              References
            </h2>
            <ol className="mt-5 space-y-3 text-sm">
              {data.references.map((r, i) => (
                <li key={i} className="flex gap-3 text-foreground/80">
                  <span className="flex-none font-medium text-muted-foreground">
                    {i + 1}.
                  </span>
                  <span>
                    <span className="text-foreground">{r.authors}</span> ({r.year}).{" "}
                    <em>{r.title}</em>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-xl border border-border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
              References cited above are public-domain bibliographic citations
              provided for research context. They do not imply endorsement, and
              the underlying studies were not necessarily conducted on Viora&apos;s
              specific synthesized compounds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
