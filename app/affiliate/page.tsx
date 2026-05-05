import Link from "next/link";

export const metadata = { title: "Affiliate Program" };

const tiers = [
  {
    name: "Researcher",
    rate: "10%",
    threshold: "Open to all approved researchers",
    perks: [
      "10% commission on referred research orders",
      "Custom referral link + tracking dashboard",
      "Monthly payouts via ACH or PayPal",
      "Marketing assets and educational copy",
    ],
    featured: false,
  },
  {
    name: "Clinical Partner",
    rate: "15%",
    threshold: "Licensed clinicians + research practices",
    perks: [
      "15% commission across all categories",
      "Co-branded portal access for your team",
      "Priority COA delivery for active studies",
      "Quarterly bulk-pricing tier eligibility",
    ],
    featured: true,
  },
  {
    name: "Institutional",
    rate: "20%",
    threshold: "Universities, labs, and research collectives",
    perks: [
      "20% commission + bulk discounts stacked",
      "Dedicated account manager",
      "Custom catalog + private formulations",
      "Compliance and procurement assistance",
    ],
    featured: false,
  },
];

const steps = [
  {
    n: "01",
    title: "Apply",
    body: "Submit a short application — we review every applicant for research-use compliance.",
  },
  {
    n: "02",
    title: "Get Approved",
    body: "Approved partners get a tracking link, dashboard access, and onboarding within 48 hours.",
  },
  {
    n: "03",
    title: "Refer",
    body: "Share your link with researchers, clinicians, or labs in your network.",
  },
  {
    n: "04",
    title: "Get Paid",
    body: "Earn commission on every approved order. Payouts process the first week of each month.",
  },
];

export default function AffiliatePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 bg-[url('/bg/dna-molecules.jpg')] bg-cover bg-center opacity-[0.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-soft/60 via-background to-background" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-24">
          <div className="text-xs font-medium uppercase tracking-wider text-brand">
            Affiliate Program
          </div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Earn up to <span className="text-brand">20%</span> referring research-grade peptides.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Built for researchers, clinicians, and institutional partners — the Viora
            Affiliate Program rewards you for sending verified, compliant research orders
            our way.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="#apply"
              className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
            >
              Apply Now
            </Link>
            <Link
              href="#tiers"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
            >
              See Tiers
            </Link>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section id="tiers" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <div className="text-xs font-medium uppercase tracking-wider text-brand">
            Commission Tiers
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Three tiers, scaled to your reach.
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-3xl border p-8 ${
                t.featured
                  ? "border-brand bg-brand text-brand-foreground shadow-xl"
                  : "border-border bg-background"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-foreground">
                  Most Popular
                </span>
              )}
              <div
                className={`text-xs font-medium uppercase tracking-wider ${
                  t.featured ? "text-brand-foreground/70" : "text-brand"
                }`}
              >
                {t.name}
              </div>
              <div
                className={`mt-3 text-5xl font-semibold ${
                  t.featured ? "text-brand-foreground" : "text-foreground"
                }`}
              >
                {t.rate}
              </div>
              <div
                className={`text-sm ${
                  t.featured ? "text-brand-foreground/70" : "text-muted-foreground"
                }`}
              >
                commission per order
              </div>
              <div
                className={`mt-4 text-sm ${
                  t.featured ? "text-brand-foreground/80" : "text-muted-foreground"
                }`}
              >
                {t.threshold}
              </div>
              <ul className="mt-6 space-y-3 border-t pt-6">
                {t.perks.map((p) => (
                  <li
                    key={p}
                    className={`flex items-start gap-2 text-sm ${
                      t.featured ? "text-brand-foreground/90" : "text-foreground"
                    }`}
                  >
                    <span
                      className={`mt-1 h-1.5 w-1.5 flex-none rounded-full ${
                        t.featured ? "bg-accent" : "bg-brand"
                      }`}
                    />
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                href="#apply"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 ${
                  t.featured
                    ? "bg-background text-brand"
                    : "bg-brand text-brand-foreground"
                }`}
              >
                Apply for {t.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <div className="text-xs font-medium uppercase tracking-wider text-brand">
              How It Works
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              From application to payout in four steps.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <div className="font-mono text-sm font-medium text-brand">{s.n}</div>
                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <div className="text-xs font-medium uppercase tracking-wider text-brand">
            Apply
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Apply to the Affiliate Program
          </h2>
          <p className="mt-3 text-muted-foreground">
            Approvals typically within 48 hours. We're selective — partners must align
            with research-use compliance.
          </p>
        </div>
        <form
          action="/api/contact"
          method="post"
          className="mt-10 space-y-4 rounded-3xl border border-border bg-background p-6 sm:p-8"
        >
          <input type="hidden" name="topic" value="Affiliate application" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full Name" name="name" required />
            <Field label="Email" name="email" type="email" required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Organization" name="organization" />
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
                Tier of Interest
              </label>
              <select
                name="tier"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              >
                <option>Researcher (10%)</option>
                <option>Clinical Partner (15%)</option>
                <option>Institutional (20%)</option>
              </select>
            </div>
          </div>
          <Field label="Website / LinkedIn / ORCID" name="profile" />
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
              Tell us about your audience
            </label>
            <textarea
              name="message"
              rows={5}
              required
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              placeholder="Who are you referring? What's your research focus?"
            />
          </div>
          <label className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <input type="checkbox" required className="mt-0.5 accent-brand" />
            I confirm referrals will be researchers and clinicians (21+) ordering
            strictly for research, not human consumption.
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
          >
            Submit Application
          </button>
        </form>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-brand">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-14 text-center text-brand-foreground sm:px-6 lg:flex-row lg:text-left">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Questions before you apply?
            </h3>
            <p className="mt-2 text-brand-foreground/80">
              Talk to our affiliate team — we typically reply within one business day.
            </p>
          </div>
          <Link
            href="/contact?topic=Affiliate%20inquiry"
            className="inline-flex items-center justify-center rounded-full bg-background px-6 py-3 text-sm font-medium text-brand transition-opacity hover:opacity-90"
          >
            Talk to the Team
          </Link>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />
    </div>
  );
}
