import { CoaVerifyForm } from "@/components/coa-verify-form";
import { PolarisHeader } from "@/components/polaris-header";

const POLARIS_TITLE = "Polaris Analytical · Independent Peptide Testing & COA Verification";
const POLARIS_DESC =
  "Polaris Analytical provides third-party HPLC and mass spectrometry testing for research peptides. Verify any Polaris-issued COA by batch number.";

export const metadata = {
  title: { absolute: POLARIS_TITLE },
  description: POLARIS_DESC,
  robots: { index: false, follow: false }, // not yet public
  // Override Viora favicons inherited from app/icon.png + app/apple-icon.png
  // so polarisanalytical.com shows its own compass-rose mark.
  icons: {
    icon: [
      { url: "/polaris-favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/polaris-icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/polaris-apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/polaris-favicon-32.png",
  },
  openGraph: { title: POLARIS_TITLE, description: POLARIS_DESC, type: "website" as const },
  twitter: { card: "summary" as const, title: POLARIS_TITLE, description: POLARIS_DESC },
};

const SERVICES = [
  {
    title: "HPLC Purity Analysis",
    body: "High-Performance Liquid Chromatography with calibrated reference standards. Determines exact purity percentage and flags impurities or byproducts.",
  },
  {
    title: "Mass Spectrometry",
    body: "Confirms molecular identity and exact molecular weight. Detects unexpected fragments or wrong sequences.",
  },
  {
    title: "Endotoxin Testing",
    body: "Limulus amebocyte lysate (LAL) assay confirms endotoxin levels are below research-grade thresholds.",
  },
  {
    title: "Stability & Reconstitution",
    body: "Ongoing stability studies under controlled lab-light conditions. Guidance for solvent, ratio, and storage parameters.",
  },
];

export default function PolarisPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#1a2342]">
      <PolarisHeader />

      {/* Hero */}
      <section className="border-b border-[#e4e8ee] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a4d6f]">
                Independent Analytical Lab
              </div>
              <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-[#1a2342] sm:text-5xl">
                Third-party verification for research-grade peptides.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#1a2342]/75 sm:text-lg">
                Polaris Analytical provides independent HPLC and mass spectrometry
                analysis for research peptides, verifying purity and molecular
                identity for laboratories, suppliers, and research institutions.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#verify"
                  className="inline-flex items-center justify-center rounded-md bg-[#0a4d6f] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Verify a COA →
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center rounded-md border border-[#cdd5e0] bg-white px-6 py-3 text-sm font-semibold text-[#1a2342] transition-colors hover:border-[#0a4d6f]"
                >
                  Our methods
                </a>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#e4e8ee] bg-[#fafbfc] p-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#0a4d6f]">
                  Independent · Accredited · Transparent
                </div>
                <ul className="mt-4 space-y-3 text-sm text-[#1a2342]/85">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#0a4d6f]" />
                    HPLC + mass spec on every batch
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#0a4d6f]" />
                    Independent third-party testing only — no in-house manufacturing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#0a4d6f]" />
                    Calibrated reference standards traceable to NIST
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#0a4d6f]" />
                    COAs publicly verifiable by batch number
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verify COA tool */}
      <section id="verify" className="border-b border-[#e4e8ee] bg-[#fafbfc]">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a4d6f]">
              Verify a COA
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Confirm any Polaris-issued COA in seconds.
            </h2>
            <p className="mt-3 text-sm text-[#1a2342]/70">
              Enter the batch / lot number from the bottom of any Polaris
              Analytical COA. We&apos;ll surface the original analytical report.
            </p>
          </div>
          <CoaVerifyForm />
          <p className="mt-3 text-center text-xs text-[#5a6a7e]">
            Try a sample: <code className="rounded bg-white px-1.5 py-0.5 text-[#0a4d6f]">VHC-2649801</code>{" "}
            or <code className="rounded bg-white px-1.5 py-0.5 text-[#0a4d6f]">VHC-1058642</code>.
          </p>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a4d6f]">
              Services
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Analytical methods we run.
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-[#e4e8ee] bg-[#fafbfc] p-6"
              >
                <h3 className="text-lg font-bold text-[#1a2342]">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#1a2342]/75">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methods strip */}
      <section id="methods" className="bg-[#0a4d6f] text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6">
          <Stat value="≥99%" label="HPLC purity threshold for research-grade certification" />
          <Stat value="< 24h" label="Standard turnaround on routine HPLC + MS panels" />
          <Stat value="NIST" label="Reference standards traceable to National Institute of Standards" />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-y border-[#e4e8ee] bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            For supplier and institutional inquiries
          </h2>
          <p className="mt-3 text-sm text-[#1a2342]/70">
            Polaris Analytical works with research peptide suppliers, university
            labs, and institutional research centers requiring independent
            third-party COA generation.
          </p>
          <a
            href="mailto:contact@polarisanalytical.com"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-[#0a4d6f] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            contact@polarisanalytical.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#fafbfc] py-10 text-center text-xs text-[#5a6a7e]">
        © 2026 Polaris Analytical · Independent third-party analytical lab
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold tracking-tight sm:text-4xl">{value}</div>
      <div className="mt-2 text-xs leading-relaxed text-white/70">{label}</div>
    </div>
  );
}
