import Link from "next/link";

export const metadata = {
  title: "Polaris Analytical · Independent Peptide Testing & COA Verification",
  description:
    "Polaris Analytical provides third-party HPLC and mass spectrometry testing for research peptides. Verify any Polaris-issued COA by batch number.",
  robots: { index: false, follow: false }, // not yet public
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
      {/* Header */}
      <header className="border-b border-[#e4e8ee] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
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
          <nav className="hidden gap-7 sm:flex">
            <a href="#services" className="text-sm text-[#1a2342]/75 hover:text-[#0a4d6f]">
              Services
            </a>
            <a href="#methods" className="text-sm text-[#1a2342]/75 hover:text-[#0a4d6f]">
              Methods
            </a>
            <a href="#verify" className="text-sm font-semibold text-[#0a4d6f]">
              Verify a COA
            </a>
            <a href="#contact" className="text-sm text-[#1a2342]/75 hover:text-[#0a4d6f]">
              Contact
            </a>
          </nav>
        </div>
      </header>

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
              Analytical COA. We'll surface the original analytical report.
            </p>
          </div>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Batch number — e.g., POL-2649801"
              className="flex-1 rounded-md border border-[#cdd5e0] bg-white px-4 py-3 text-sm outline-none focus:border-[#0a4d6f] focus:ring-1 focus:ring-[#0a4d6f]"
            />
            <button
              type="submit"
              className="rounded-md bg-[#0a4d6f] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Verify
            </button>
          </form>
          <p className="mt-3 text-center text-xs text-[#5a6a7e]">
            Don't have a batch number? Sample COAs available on the{" "}
            <a href="#services" className="text-[#0a4d6f] hover:underline">
              services page
            </a>
            .
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

function PolarisLogo() {
  return (
    <svg viewBox="0 0 64 64" className="h-9 w-9" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="28" stroke="#0a4d6f" strokeWidth="3" fill="white" />
      {/* North-star compass mark */}
      <path d="M32 14 L34 30 L48 32 L34 34 L32 50 L30 34 L16 32 L30 30 Z" fill="#0a4d6f" />
      <circle cx="32" cy="32" r="3" fill="white" />
    </svg>
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
