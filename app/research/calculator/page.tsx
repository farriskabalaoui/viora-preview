import Link from "next/link";
import { PeptideCalculator } from "@/components/peptide-calculator";

export const metadata = {
  title: "Peptide Reconstitution Calculator",
  description:
    "Free interactive calculator for peptide reconstitution math. Calculate vial concentration and exact volume to draw — instant results.",
};

export default function CalculatorPage() {
  return (
    <>
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <nav className="text-xs text-muted-foreground">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/research" className="hover:text-brand">
              Research Library
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Calculator</span>
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <PeptideCalculator />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight">How the math works</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-background p-5">
              <div className="font-mono text-sm font-bold text-brand">Step 1</div>
              <h3 className="mt-2 text-base font-semibold">Calculate concentration</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Vial mg ÷ bacteriostatic water mL = concentration in mg/mL.
                Example: 10 mg in 5 mL = 2 mg/mL.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-5">
              <div className="font-mono text-sm font-bold text-brand">Step 2</div>
              <h3 className="mt-2 text-base font-semibold">Calculate volume</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Desired dose mg ÷ concentration mg/mL = volume mL to draw.
                Example: 0.05 mg ÷ 2 mg/mL = 0.025 mL.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-5">
              <div className="font-mono text-sm font-bold text-brand">Step 3</div>
              <h3 className="mt-2 text-base font-semibold">Convert to units</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Insulin syringes are U-100 (100 units = 1 mL).
                Volume mL × 100 = units to draw. 0.025 mL = 2.5 units.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold tracking-tight">Related reading</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/research/peptide-reconstitution-guide"
                  className="text-brand hover:underline"
                >
                  Peptide Reconstitution Guide → solvents, sterile technique, storage
                </Link>
              </li>
              <li>
                <Link
                  href="/research/hplc-vs-mass-spec"
                  className="text-brand hover:underline"
                >
                  HPLC vs Mass Spec → why purity matters before reconstitution
                </Link>
              </li>
              <li>
                <Link
                  href="/research/reading-a-coa"
                  className="text-brand hover:underline"
                >
                  How to Read a COA → verify what's actually in your vial
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
