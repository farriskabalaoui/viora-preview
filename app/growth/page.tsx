import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Viora · Revenue Engine + Apps (Internal)",
  robots: { index: false, follow: false, nocache: true },
};

const milestones = [
  {
    target: "$1M ARR",
    timeline: "Month 6–8",
    body: "Cold outreach + Vee + retention email. ~700 orders/month at ~$120 AOV.",
    drivers: ["Outreach Agent (8–25 consults/mo)", "Vee qualifier (24/7)", "Retention drip (Klaviyo)"],
  },
  {
    target: "$5M ARR",
    timeline: "Month 12–15",
    body: "Affiliate program scaled + institutional B2B + programmatic SEO compounding. Diversified channel mix, no single point of failure.",
    drivers: [
      "100 active affiliates",
      "10–15 institutional accounts ($3–10K/mo each)",
      "Programmatic SEO (50–80K monthly visits)",
      "Subscriptions / auto-replenish",
    ],
  },
  {
    target: "$10M+ ARR",
    timeline: "Month 18–24",
    body: "Apps drive repeat-buy lock-in. Custom compounding for institutions. Paid media amplifies what's already profitable.",
    drivers: [
      "Viora Lab app driving 30–50% of reorders",
      "Viora Direct (B2B portal) closing PO/Net-30 deals",
      "Custom blends for clinic networks",
      "Profitable paid media at LTV/CAC > 3",
    ],
  },
];

const agents = [
  {
    n: "01",
    title: "Discovery Agent",
    impact: "Finds the buyers competitors don't know exist yet.",
    body:
      "Pulls from open public APIs only — PubMed, NIH RePORTER, ClinicalTrials.gov, OpenAlex, FDA registrations. No scraping, no TOS-grey areas. Filters to U.S. researchers actively publishing in metabolic, recovery, longevity, hormone, gut, or cognitive research within 18 months. Enriches via Apollo or Hunter (legitimate publisher-consent APIs).",
    revenue: "Feeds outreach + affiliate agents. Cost <$1.50 per qualified lead.",
    metrics: [
      { label: "Net new researchers / month", value: "300–800" },
      { label: "Email match rate", value: "70–85%" },
    ],
    stack: ["PubMed E-utilities", "OpenAlex", "NIH RePORTER", "Apollo.io", "Claude scoring"],
  },
  {
    n: "02",
    title: "Outreach Agent",
    impact: "Cold email that references each researcher's actual work — not templates.",
    body:
      "Reads each prospect's last 1–2 papers and generates a 3-step email sequence specific to their research. Sends through Instantly or Smartlead with proper SPF/DKIM/DMARC + warmup. Replies route to a smart inbox: positive intent auto-books a Cal.com consult; cold replies get nurtured. CAN-SPAM + CASL compliant. Email-only — LinkedIn automation gets accounts banned, not worth it.",
    revenue:
      "8–25 consults/month × 50% close × $300 first order × 60% reorder LTV multiplier ≈ **$30–95K/month new revenue by month 6**.",
    metrics: [
      { label: "Reply rate (realistic)", value: "2–4%" },
      { label: "Booked consults / month", value: "8–25" },
    ],
    stack: ["Instantly / Smartlead", "Claude (drafting)", "Cal.com webhooks", "Reply classifier"],
  },
  {
    n: "03",
    title: "Vee · On-Site Qualifier",
    impact: "Already live. Turns the visitors you already have into buyers.",
    body:
      "Real Claude Sonnet 4.6 with the full product catalog cached in the system prompt. Answers compound questions, surfaces COAs, qualifies bulk and institutional prospects, and books warm leads onto your calendar. Compliance-locked — no human-dosing advice, no medical claims, 21+ checks. Pre-loads context for anyone arriving from an outreach email.",
    revenue:
      "Visitor-to-lead lift of 1.5–3× = **+$15–40K/month** at typical commerce conversion rates.",
    metrics: [
      { label: "Visitor-to-lead lift", value: "1.5–3×" },
      { label: "Avg session time gain", value: "+60s" },
    ],
    stack: ["Claude Sonnet 4.6", "Streaming SSE", "Prompt caching", "Already operational"],
  },
  {
    n: "04",
    title: "Retention Agent",
    impact:
      "Lifecycle email + SMS that turns first-time buyers into 4–6× LTV customers.",
    body:
      "Klaviyo or Customer.io with smart segmentation: post-purchase research-protocol guides, replenishment reminders timed to typical study cadence (8–12 weeks), abandoned-cart recovery, win-back for dormant labs, COA digest for active researchers. Every flow A/B tested. Email is the highest-ROI channel in commerce — typically drives 25–35% of revenue. Most peptide suppliers leave it on the table.",
    revenue:
      "If Viora is doing $50K/mo organic by month 6, this adds **+$15–18K/month**. By month 12 at $200K/mo organic, **+$50K/month**.",
    metrics: [
      { label: "% of revenue from email/SMS", value: "25–35%" },
      { label: "Abandoned-cart recovery", value: "10–15% of carts" },
    ],
    stack: ["Klaviyo", "Twilio (SMS)", "Claude (subject-line optimization)", "Stripe events"],
  },
  {
    n: "05",
    title: "Affiliate Amplification Agent",
    impact:
      "Recruits + activates 50–100 affiliates: longevity podcasters, performance clinics, functional med practitioners.",
    body:
      "Discovery agent's cousin — finds podcasters, YouTube channels, clinic owners, and longevity influencers in the peptide research space. Outreach agent pitches them the affiliate program. New page builds tier-customized landing pages per affiliate (their photo, their angle, custom code). Real-time dashboard so they see commissions accrue. Auto-payout via Stripe Connect.",
    revenue:
      "100 active affiliates × $500/mo avg in driven sales × 15% commission = **+$50K/month gross sales, $7.5K paid out**.",
    metrics: [
      { label: "Active affiliates (target)", value: "50–100" },
      { label: "Avg revenue / affiliate", value: "$300–800/mo" },
    ],
    stack: ["Rewardful / FirstPromoter", "Stripe Connect", "Custom landing-page generator", "Discovery agent"],
  },
  {
    n: "06",
    title: "SEO Content Engine",
    impact:
      "Programmatic content moat that compounds month over month — the only channel competitors can't outbid.",
    body:
      "Generates 200+ programmatic pages: each compound × research model × use case (e.g., 'BPC-157 in tendon repair research', 'GHK-Cu in dermatology research literature'). Plus comparison pages (BPC-157 vs TB-500), protocol guides, and a research literature digest updated monthly. Every page is genuinely useful, properly cited, and ranks because researchers Google these queries every day. By month 12 this is your cheapest acquisition channel.",
    revenue:
      "Slow start, compounds hard. Typical trajectory: **0 → 50K monthly visits by month 12, 200K+ by month 18**. At 1% conversion, that's $60K/mo by month 12, $240K/mo by month 18.",
    metrics: [
      { label: "Pages generated", value: "200+" },
      { label: "Monthly organic visits (mo 12)", value: "50–80K" },
    ],
    stack: ["Next.js SSG", "Claude (content)", "Ahrefs (keywords)", "Schema.org structured data"],
  },
];

const apps = [
  {
    name: "Viora Lab",
    subtitle: "Researcher App — iOS + Android",
    pitch:
      "The companion app for the researchers who buy from Viora. No peptide supplier has built this. Once a lab tracks their workflow inside Viora Lab, they reorder from their phone — not from your competitors' Google ads.",
    revenueAngle:
      "Native push + 1-tap reorder typically lifts repeat-buy rate **30–50%**. On a $200K/mo customer base, that's **+$60–100K/month** of pure repeat revenue.",
    features: [
      {
        title: "Protocol Builder",
        body: "Pick a research focus → app composes a protocol scaffold around Viora stacks with dose math, reconstitution math, timing. Exports to PDF.",
      },
      {
        title: "COA Vault + QR Scan",
        body: "Scan QR on Viora vial → see exact COA for that batch. Anti-counterfeit. Solves the #1 question every cold researcher asks.",
      },
      {
        title: "Reconstitution Calculator",
        body: "Enter mg + desired concentration → BAC water volume + per-unit dosing. Eliminates ~40% of support emails.",
      },
      {
        title: "Lab Inventory + Auto-Reorder",
        body: "Track what's in your lab. Low-stock push notifications. One-tap reorder pushes straight to checkout with stored portal credentials.",
      },
      {
        title: "Push Notifications",
        body: "New batch shipped, new COA, restocked compound, special offer. Brings researchers back without paid ads.",
      },
      {
        title: "Receipts for Grant Accounting",
        body: "Downloadable invoices, W-9 storage, tax docs. Real pain point for academic labs and a stickiness multiplier.",
      },
    ],
    timeline: "8–10 weeks for v1",
    stack: "Expo (React Native) on iOS + Android",
  },
  {
    name: "Viora Direct",
    subtitle: "Institutional B2B Portal — Web App",
    pitch:
      "Where the biggest checks live. Universities, hospitals, longevity clinics, and research centers don't buy through retail checkout — they need POs, Net-30 terms, multi-user accounts, custom pricing, and compliance docs at scale. No competitor has nailed this experience. Whoever does owns the institutional segment.",
    revenueAngle:
      "Average institutional account: **$3–10K/month**. Just **15 active accounts = $45–150K/month** = $540K–$1.8M ARR from one channel.",
    features: [
      {
        title: "PO + Net-30 Invoicing",
        body: "Submit a purchase order, get an invoice, pay net-30. Stripe Invoicing or Bill.com integration. Removes the #1 reason institutions buy elsewhere.",
      },
      {
        title: "Multi-User Lab Accounts",
        body: "Lab admins manage user permissions. PIs approve orders. Researchers shop. Procurement signs off. One account, real workflow.",
      },
      {
        title: "Custom Pricing Tiers",
        body: "Volume-based discounts that auto-apply. Quotes generated on demand. Negotiated rates per institution.",
      },
      {
        title: "Compliance Doc Center",
        body: "W-9s, certificates of insurance, sample COAs, MSDS sheets, terms of sale — all auto-generated and downloadable. What procurement asks for, on demand.",
      },
      {
        title: "Bulk + Custom Compounding",
        body: "Higher-ticket service: custom blend ratios, bulk vials, cold-chain shipping at scale. $5K+ orders. Margin lift vs retail.",
      },
      {
        title: "Account Manager Dashboard",
        body: "For Marvin's team: see every active account's health, usage, last-order date, and predicted reorder. Outbound trigger when accounts go quiet.",
      },
    ],
    timeline: "10–14 weeks for v1",
    stack: "Next.js extension of current site, Stripe + Bill.com",
  },
];

export default function GrowthPage() {
  return (
    <>
      {/* Internal banner */}
      <div className="bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6">
          <span className="font-mono uppercase tracking-wider opacity-70">
            Internal · Viora ↔ Farris · Phase 2 + 3
          </span>
          <span className="hidden text-background/60 sm:block">
            Not indexed · Direct link only
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div
          aria-hidden
          className="absolute inset-0 bg-[url('/bg/dna-molecules.jpg')] bg-cover bg-center opacity-[0.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-soft/50 via-background to-background" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            The path from $0 to $10M ARR
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Six agents.
            <br />
            <span className="text-brand">Two apps.</span>
            <br />
            One revenue machine.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            This isn't a marketing pitch. It's a revenue plan. Every component below
            maps to a specific dollar contribution and a realistic timeline. Built
            on the same stack already powering Vee on this site.
          </p>
        </div>
      </section>

      {/* Revenue ladder */}
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-brand">
              The Math
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              How Viora gets to $1M, $5M, $10M.
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Every milestone has a channel mix and a timeline. No single tactic gets
              you there. The agents and apps below are the components — these are the
              checkpoints they're working toward.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {milestones.map((m) => (
              <div
                key={m.target}
                className="flex flex-col rounded-3xl border border-border bg-background p-8"
              >
                <div className="text-xs font-medium uppercase tracking-wider text-brand">
                  {m.timeline}
                </div>
                <div className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
                  {m.target}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {m.body}
                </p>
                <div className="mt-6 border-t border-border pt-5">
                  <div className="text-xs font-medium uppercase tracking-wider text-foreground/70">
                    Drivers
                  </div>
                  <ul className="mt-3 space-y-2 text-sm">
                    {m.drivers.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-foreground/90">
                        <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 2 — Agents */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-brand">
            Phase 2 — Six Agents
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Each agent owns one revenue lever.
          </h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Buildable on real APIs. Compliance-first. Honest projections, not agency
            inflation. Each one stands alone — together they compound.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {agents.map((a) => (
            <div
              key={a.n}
              className="grid grid-cols-1 gap-8 rounded-3xl border border-border bg-background p-8 lg:grid-cols-12 lg:p-10"
            >
              <div className="lg:col-span-1">
                <div className="font-mono text-2xl font-semibold text-brand">{a.n}</div>
              </div>
              <div className="lg:col-span-7">
                <h3 className="text-2xl font-semibold tracking-tight">{a.title}</h3>
                <p className="mt-2 text-base font-medium text-brand">{a.impact}</p>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {a.body}
                </p>
                <div className="mt-5 rounded-xl border border-brand/30 bg-brand-soft p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-brand">
                    Revenue impact
                  </div>
                  <p
                    className="mt-1 text-sm leading-relaxed text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: a.revenue.replace(
                        /\*\*([^*]+)\*\*/g,
                        '<strong class="text-foreground">$1</strong>',
                      ),
                    }}
                  />
                </div>
                <div className="mt-5">
                  <div className="text-xs font-medium uppercase tracking-wider text-foreground/70">
                    Stack
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {a.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-border bg-muted/50 px-3 py-1 font-mono text-xs text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4">
                <div className="rounded-2xl border border-border bg-muted/30 p-5">
                  <div className="text-xs font-medium uppercase tracking-wider text-brand">
                    Honest projections
                  </div>
                  <div className="mt-3 space-y-3">
                    {a.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="text-2xl font-semibold text-foreground">
                          {m.value}
                        </div>
                        <div className="text-xs text-muted-foreground">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Phase 3 — Two apps */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-brand">
              Phase 3 — Two Apps
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Where Viora becomes a category-defining brand.
            </h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              The agents bring researchers in. The apps make sure they never leave.
              Researchers and institutions are two different buyers — they need two
              different products.
            </p>
          </div>
          <div className="mt-12 space-y-10">
            {apps.map((app) => (
              <div
                key={app.name}
                className="grid grid-cols-1 gap-8 rounded-3xl border border-border bg-background p-8 lg:grid-cols-12 lg:p-12"
              >
                <div className="lg:col-span-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-brand">
                    {app.subtitle}
                  </div>
                  <h3 className="mt-2 text-3xl font-semibold tracking-tight">
                    {app.name}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {app.pitch}
                  </p>
                  <div className="mt-5 rounded-xl border border-brand/30 bg-brand-soft p-4">
                    <div className="text-xs font-medium uppercase tracking-wider text-brand">
                      Revenue angle
                    </div>
                    <p
                      className="mt-1 text-sm leading-relaxed text-foreground"
                      dangerouslySetInnerHTML={{
                        __html: app.revenueAngle.replace(
                          /\*\*([^*]+)\*\*/g,
                          '<strong class="text-foreground">$1</strong>',
                        ),
                      }}
                    />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-border bg-muted/40 p-4">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        Build time
                      </div>
                      <div className="mt-1 font-semibold">{app.timeline}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/40 p-4">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        Stack
                      </div>
                      <div className="mt-1 font-semibold">{app.stack}</div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {app.features.map((f, i) => (
                      <div
                        key={f.title}
                        className="rounded-2xl border border-border bg-muted/40 p-5"
                      >
                        <div className="font-mono text-xs text-brand">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <h4 className="mt-2 text-base font-semibold text-foreground">
                          {f.title}
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {f.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reporting */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-brand">
              You see everything
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Weekly auto-reports. No blind retainers.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every Monday a one-page report lands in your inbox: which agent
              generated which lead, which app event led to which reorder, what each
              channel cost vs returned. Revenue attribution by source, not vibes.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Source-level lead reporting (which database, which research focus)",
                "Per-sequence reply rates so we kill what's not working fast",
                "App install + DAU + reorder cohort tracking",
                "Revenue attribution back to the originating agent or app event",
                "LTV/CAC monitoring — when ratios > 3, we recommend paid media to amplify",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                  <span className="text-foreground/90">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border">
            <Image
              src="/bg/atmospheric.webp"
              alt="Reporting"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand/85 via-brand/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <div className="text-xs font-medium uppercase tracking-wider opacity-80">
                Sample week (month 6)
              </div>
              <div className="mt-2 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-3xl font-semibold">$47K</div>
                  <div className="text-xs opacity-80">Attributed revenue</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold">14</div>
                  <div className="text-xs opacity-80">Booked consults</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold">3.2×</div>
                  <div className="text-xs opacity-80">LTV / CAC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement */}
      <section className="border-y border-border bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="text-xs font-medium uppercase tracking-wider text-accent">
            Engagement
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            What this looks like in dollars.
          </h2>
          <p className="mt-4 max-w-2xl text-background/70">
            I build it, run it, and report on it. Three structures depending on how
            you'd rather pay. The apps are priced separately as fixed-scope add-ons.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[
              {
                name: "Partner",
                tagline: "Recommended",
                price: "$5K + $2.5K/mo",
                extra: "+ 5% equity + 10% rev share (18mo)",
                body:
                  "Cash floor pays for the work, equity aligns long term, rev share rewards what the agents bring in. Site rebuild + agents only — apps are priced separately ($25K Viora Lab v1, $35K Viora Direct v1).",
                featured: true,
              },
              {
                name: "Cash-Heavy",
                tagline: "Clean transactional",
                price: "$8.5K + $4.5K/mo",
                extra: "Apps: +$35K + $50K. No equity, no rev share.",
                body:
                  "Higher cash, no cap-table conversation. Good if Viora is well-capitalized and prefers vendor relationships.",
                featured: false,
              },
              {
                name: "Equity-Heavy",
                tagline: "Cash-light, upside-aligned",
                price: "$0 cash",
                extra: "10% equity + 15% rev share (24mo). Both apps included.",
                body:
                  "I take on the risk. You preserve runway. Only fits if Viora has a clear capital plan and you're comfortable with higher dilution.",
                featured: false,
              },
            ].map((opt) => (
              <div
                key={opt.name}
                className={`rounded-3xl border p-8 ${
                  opt.featured
                    ? "border-accent bg-accent/10"
                    : "border-background/15 bg-background/[0.03]"
                }`}
              >
                <div className="text-xs font-medium uppercase tracking-wider text-accent">
                  {opt.tagline}
                </div>
                <div className="mt-3 text-2xl font-semibold">{opt.name}</div>
                <div className="mt-4 text-3xl font-semibold tracking-tight">
                  {opt.price}
                </div>
                <div className="mt-1 text-sm text-background/70">{opt.extra}</div>
                <p className="mt-5 text-sm leading-relaxed text-background/80">
                  {opt.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready when you are.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Phase 1 (the site) is done — you're looking at it. Phase 2 ships in
            sprints starting the day we sign. Phase 3 (the apps) starts when the
            agents stabilize and we have real channel data to design against.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact?topic=Phase%202%2B3%20%E2%80%94%20Revenue%20Engine%20%2B%20Apps"
              className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
            >
              Talk to Farris
            </Link>
            <a
              href="mailto:farris@kabalaoui.com?subject=Viora%20Phase%202%2B3"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-7 py-3 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
            >
              farris@kabalaoui.com
            </a>
          </div>
          <p className="mt-8 text-xs text-muted-foreground">
            This page is not linked from anywhere on viorahealthcare.com — direct
            URL only.
          </p>
        </div>
      </section>
    </>
  );
}
