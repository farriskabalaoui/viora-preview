import Link from "next/link";
import { notFound } from "next/navigation";
import { getCoa, POLARIS_LAB } from "@/lib/coas";

type Props = {
  params: Promise<{ batch: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { batch } = await params;
  const coa = getCoa(batch);
  if (!coa) return { title: "COA not found · Polaris Analytical" };
  return {
    title: `${coa.compound} batch ${coa.batch} · COA · Polaris Analytical`,
    description: `Independent third-party Certificate of Analysis for ${coa.compound} batch ${coa.batch} — ${coa.purityResult} purity by UPLC/MS.`,
    robots: { index: false, follow: false },
  };
}

export default async function CoaPage({ params }: Props) {
  const { batch } = await params;
  const coa = getCoa(batch);
  if (!coa) notFound();

  const fmtDate = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#1a2342] print:bg-white">
      {/* Polaris ribbon — hides on print */}
      <header className="border-b border-[#e4e8ee] bg-white print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/polaris" className="flex items-center gap-2">
            <PolarisLogo />
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight text-[#1a2342]">
                POLARIS
              </span>
              <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.25em] text-[#5a6a7e]">
                Analytical
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-3 text-sm sm:gap-5">
            <Link
              href="/polaris#verify"
              className="hidden text-[#1a2342]/75 hover:text-[#0a4d6f] sm:inline"
            >
              Verify another COA
            </Link>
            <a
              href={`/coas/polaris/${coa.batch}.pdf`}
              className="rounded-md bg-[#0a4d6f] px-3 py-2 text-xs font-semibold text-white hover:opacity-90 sm:px-4"
            >
              Download PDF
            </a>
          </nav>
        </div>
      </header>

      {/* The COA — designed to print as a single A4 page */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 print:py-0">
        <article className="rounded-2xl border border-[#e4e8ee] bg-white p-8 sm:p-12 print:rounded-none print:border-0 print:p-0">
          {/* Letterhead */}
          <div className="flex flex-col gap-4 border-b-2 border-[#0a4d6f] pb-5 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
            <div>
              <div className="flex items-center gap-3">
                <PolarisLogo />
                <div>
                  <div className="text-lg font-bold tracking-tight text-[#1a2342] sm:text-xl">
                    POLARIS ANALYTICAL
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0a4d6f]">
                    Independent Analytical Lab
                  </div>
                </div>
              </div>
              <div className="mt-2 text-[11px] leading-relaxed text-[#5a6a7e]">
                {POLARIS_LAB.contactEmail} · {POLARIS_LAB.hostname}
              </div>
            </div>
            <div className="sm:text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#5a6a7e]">
                Certificate of Analysis
              </div>
              <div className="mt-1 font-mono text-sm text-[#1a2342]">
                Lot #{coa.batch}
              </div>
            </div>
          </div>

          {/* Subject + dates */}
          <div className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <KV label="Compound" value={coa.compound} />
            <KV label="Client" value={coa.clientName} />
            <KV label="Received" value={fmtDate(coa.receivedDate)} />
            <KV label="Analysis Conducted" value={fmtDate(coa.analysisDate)} />
          </div>

          {/* Identification */}
          <h2 className="mt-8 border-b border-[#e4e8ee] pb-2 text-xs font-semibold uppercase tracking-wider text-[#0a4d6f]">
            Identification
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <KV label="Appearance" value={coa.appearance} />
            <KV label="CAS Number" value={coa.cas} />
            <KV label="Molecular Formula" value={coa.formula} mono />
            <KV label="Molecular Weight" value={coa.molWeight} />
            <KV label="PubChem CID" value={coa.pubchemCid} mono />
          </div>

          {/* Method */}
          <h2 className="mt-8 border-b border-[#e4e8ee] pb-2 text-xs font-semibold uppercase tracking-wider text-[#0a4d6f]">
            Method
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#1a2342]/80">
            Qualitative and quantitative chemical analysis by Ultra High Performance
            Liquid Chromatography with Mass Spectrometry (UPLC-MS) under standard
            laboratory conditions, following validated analytical protocols.
          </p>

          {/* Results */}
          <h2 className="mt-8 border-b border-[#e4e8ee] pb-2 text-xs font-semibold uppercase tracking-wider text-[#0a4d6f]">
            Results
          </h2>
          <table className="mt-4 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#e4e8ee] text-left text-[11px] font-semibold uppercase tracking-wider text-[#5a6a7e]">
                <th className="py-2.5">Specification</th>
                <th className="py-2.5">Result</th>
                <th className="py-2.5 text-right">Pass / Fail</th>
              </tr>
            </thead>
            <tbody>
              <ResultRow
                spec={`Compound identity: ${coa.compound}`}
                result={coa.compound}
                pass
              />
              <ResultRow
                spec={`Quantity: ${coa.quantitySpec}`}
                result={coa.quantityResult}
                pass
              />
              <ResultRow
                spec={`Purity: ${coa.puritySpec}`}
                result={coa.purityResult}
                pass
              />
            </tbody>
          </table>

          {/* Signature */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="border-b-2 border-[#1a2342] pb-1 font-serif text-xl italic text-[#1a2342]">
                {coa.signatory.name}
              </div>
              <div className="mt-1 text-[11px] leading-relaxed text-[#5a6a7e]">
                {coa.signatory.name}
                <br />
                {coa.signatory.title}, Polaris Analytical
              </div>
            </div>
            <div className="text-right text-[11px] text-[#5a6a7e]">
              <div className="inline-flex items-center gap-2 rounded-md bg-[#ecf3f7] px-3 py-2 font-mono text-xs text-[#0a4d6f]">
                Verifiable: {POLARIS_LAB.hostname}/coa/{coa.batch.toLowerCase()}
              </div>
            </div>
          </div>

          {/* Footer disclaimer */}
          <p className="mt-8 border-t border-[#e4e8ee] pt-4 text-[10px] leading-relaxed text-[#5a6a7e]">
            This Certificate of Analysis is issued by Polaris Analytical, an
            independent third-party laboratory. Results apply only to the lot
            tested. For research applications only — not intended for human
            consumption, diagnostic, or therapeutic use. Polaris Analytical does not
            manufacture, distribute, or sell research compounds.
          </p>
        </article>
      </main>
    </div>
  );
}

function KV({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[#5a6a7e]">
        {label}
      </div>
      <div className={`mt-0.5 text-sm text-[#1a2342] ${mono ? "font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function ResultRow({
  spec,
  result,
  pass,
}: {
  spec: string;
  result: string;
  pass: boolean;
}) {
  return (
    <tr className="border-b border-[#f0f3f7] text-[#1a2342]">
      <td className="py-3 text-sm">{spec}</td>
      <td className="py-3 font-mono text-sm">{result}</td>
      <td className="py-3 text-right">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${
            pass ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
          }`}
        >
          {pass ? "PASS" : "FAIL"}
        </span>
      </td>
    </tr>
  );
}

function PolarisLogo() {
  return (
    <svg viewBox="0 0 64 64" className="h-9 w-9" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="28" stroke="#0a4d6f" strokeWidth="3" fill="white" />
      <path d="M32 14 L34 30 L48 32 L34 34 L32 50 L30 34 L16 32 L30 30 Z" fill="#0a4d6f" />
      <circle cx="32" cy="32" r="3" fill="white" />
    </svg>
  );
}
