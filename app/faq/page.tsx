import Link from "next/link";
import { VIORA_PHONE_DISPLAY, VIORA_PHONE_HREF } from "@/lib/contact";

export const metadata = { title: "Frequently Asked Questions" };

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "What are research peptides?",
    a: (
      <>
        Research peptides are synthetic chains of amino acids used by scientists
        and clinicians for laboratory experimentation, biological pathway studies,
        and analytical research. Viora supplies high-purity research-grade peptides
        manufactured and tested in accredited facilities.
      </>
    ),
  },
  {
    q: "Are these peptides for human use?",
    a: (
      <>
        <strong>No.</strong> Every Viora compound is sold strictly for laboratory
        research use only. They are not for human or animal consumption,
        diagnostic, or therapeutic application. Statements have not been
        evaluated by the FDA.
        See our full{" "}
        <Link href="/consent" className="font-medium text-brand hover:underline">
          Research Use Consent
        </Link>
        .
      </>
    ),
  },
  {
    q: "Do I need a license to order?",
    a: (
      <>
        You must verify you are 21+ and accept our research-use consent to receive
        portal access. We don't require a specific license for most compounds, but
        we do require all customers to confirm research-use intent at signup AND
        per-order at checkout. Bulk and institutional orders may require
        additional documentation — contact us at{" "}
        <a href="mailto:research@viorahealthcare.com" className="font-medium text-brand hover:underline">
          research@viorahealthcare.com
        </a>
        .
      </>
    ),
  },
  {
    q: "How do you ship?",
    a: (
      <>
        All Viora orders ship from our U.S. facility in discreet, unbranded
        outer packaging. Every compound ships as stable lyophilized powder —
        no refrigeration is required in transit. You&apos;ll receive a tracking
        number as soon as your order leaves our facility, plus SMS alerts at
        every status change. <strong>Storage after reconstitution</strong> with
        bacteriostatic water requires refrigeration at 2–8 °C.
      </>
    ),
  },
  {
    q: "What's a COA and why does it matter?",
    a: (
      <>
        A Certificate of Analysis (COA) is a one-page document that confirms a
        specific batch's identity and purity, verified by a third-party
        analytical lab using HPLC and mass spectrometry. Every Viora batch ships
        with its COA, and every COA you've ever received is permanently archived
        in your account portal. Public sample COAs are available on the{" "}
        <Link href="/research#coa" className="font-medium text-brand hover:underline">
          Lab Testing page
        </Link>
        .
      </>
    ),
  },
  {
    q: "How do I get portal access?",
    a: (
      <>
        Apply for portal access at{" "}
        <Link href="/signup" className="font-medium text-brand hover:underline">
          /signup
        </Link>
        . You'll provide an email + phone (for SMS verification), confirm you are
        21+, and accept the Research Use Consent. Approval is automatic for most
        applicants — typically active within minutes of phone verification.
      </>
    ),
  },
  {
    q: "What payment methods do you accept?",
    a: (
      <>
        We accept all major credit and debit cards processed through our approved
        high-risk merchant gateway. Institutional buyers can request Net-30
        invoicing via purchase order — contact us before placing the order.
      </>
    ),
  },
  {
    q: "Do you offer institutional or bulk pricing?",
    a: (
      <>
        Yes. Universities, research clinics, and labs ordering recurring volume
        qualify for institutional pricing tiers, custom quotes, and Net-30
        invoicing terms. Email{" "}
        <a href="mailto:research@viorahealthcare.com" className="font-medium text-brand hover:underline">
          research@viorahealthcare.com
        </a>{" "}
        with your typical monthly volume and we'll respond within one business day.
      </>
    ),
  },
  {
    q: "What's your refund policy?",
    a: (
      <>
        Due to chain-of-custody requirements for laboratory chemicals, all sales
        are final once an order has shipped. We do not offer refunds, exchanges,
        or returns. If you receive a damaged or incorrect batch, contact us
        within 7 days and we'll resolve it — typically with a replacement
        shipment.
      </>
    ),
  },
  {
    q: "Do you ship internationally?",
    a: (
      <>
        At launch, Viora ships only within the United States and U.S. territories.
        We're evaluating international shipping for select countries — sign up for
        our newsletter to be notified when international shipping becomes
        available.
      </>
    ),
  },
  {
    q: "How does the Affiliate Program work?",
    a: (
      <>
        Researchers, clinicians, and longevity-content creators can earn 10–20%
        commission on referred orders. Three tiers: Researcher (10%), Clinical
        Partner (15%), Institutional (20%). Apply at{" "}
        <Link href="/affiliate" className="font-medium text-brand hover:underline">
          /affiliate
        </Link>{" "}
        — approval typically within 48 hours. Tracking + payouts handled
        automatically through our integrated affiliate platform.
      </>
    ),
  },
  {
    q: "How are peptides reconstituted and stored?",
    a: (
      <>
        Most Viora compounds ship as lyophilized (freeze-dried) powder requiring
        reconstitution with bacteriostatic water before research use. We've built
        a free{" "}
        <Link
          href="/research/calculator"
          className="font-medium text-brand hover:underline"
        >
          Peptide Reconstitution Calculator
        </Link>{" "}
        that handles the math, and a full{" "}
        <Link
          href="/research/peptide-reconstitution-guide"
          className="font-medium text-brand hover:underline"
        >
          Reconstitution Guide
        </Link>{" "}
        with sterile-technique protocols, recommended solvents, and
        post-reconstitution storage parameters.
      </>
    ),
  },
];

export default function FAQPage() {
  return (
    <>
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-xs font-medium uppercase tracking-wider text-brand">
            FAQ
          </div>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            The most common questions from researchers, clinicians, and
            institutional buyers. Don't see yours? Email{" "}
            <a href="mailto:research@viorahealthcare.com" className="font-medium text-brand hover:underline">
              research@viorahealthcare.com
            </a>{" "}
            or text{" "}
            <a href={VIORA_PHONE_HREF} className="font-medium text-brand hover:underline">
              {VIORA_PHONE_DISPLAY}
            </a>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="space-y-4">
          {faqs.map(({ q, a }, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-border bg-background p-6 transition-colors open:border-brand/40 open:bg-brand-soft/30"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 text-base font-semibold text-foreground marker:hidden">
                <span>
                  <span className="font-mono text-xs text-brand mr-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {q}
                </span>
                <svg
                  className="mt-0.5 h-5 w-5 flex-none text-muted-foreground transition-transform group-open:rotate-45"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </summary>
              <div className="mt-4 ml-9 text-sm leading-relaxed text-foreground/80">
                {a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-brand">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-14 text-center text-brand-foreground sm:px-6">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Still have questions?
          </h2>
          <p className="mt-2 max-w-xl text-brand-foreground/80">
            Vee, our AI research assistant, can answer most compound and ordering
            questions instantly. Or reach the team directly.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-background px-6 py-3 text-sm font-semibold text-brand transition-opacity hover:opacity-90"
            >
              Contact us
            </Link>
            <a
              href={VIORA_PHONE_HREF}
              className="inline-flex items-center justify-center rounded-full border border-brand-foreground/30 px-6 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-white/10"
            >
              Call {VIORA_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
