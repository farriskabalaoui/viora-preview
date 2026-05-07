import Link from "next/link";

export const metadata = { title: "Research Use Consent" };

export default function ConsentPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Research Use Consent</span>
      </nav>

      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Research Use Consent
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Version 1.0 · Effective May 2026
      </p>

      <div className="prose-content mt-10 space-y-6 text-base leading-relaxed text-foreground/85">
        <section>
          <h2 className="text-2xl font-bold text-foreground">1. Acknowledgment of Research Use Only</h2>
          <p className="mt-3">
            I acknowledge and agree that all products purchased from Viora Healthcare
            ("Viora") are intended <strong>strictly for in-vitro research use and
            laboratory experimentation only</strong>. These products are not for
            human consumption, ingestion, injection, topical application, or any
            other form of human or animal use.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground">2. Regulatory Status</h2>
          <p className="mt-3">
            I understand that Viora's research compounds are{" "}
            <strong>not approved by the U.S. Food and Drug Administration (FDA)</strong>{" "}
            for any therapeutic, diagnostic, or human-use purpose. Statements made on
            this site or in product literature have not been evaluated by the FDA
            and are not intended to diagnose, treat, cure, or prevent any disease,
            illness, or condition.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground">3. Research Risks and Unknowns</h2>
          <p className="mt-3">
            I understand that many of the compounds offered by Viora are
            investigational and have limited published long-term safety data. I
            acknowledge that the risks and effects of working with these compounds
            in any context outside of a properly controlled laboratory environment
            are not fully understood. I am responsible for conducting my own
            literature review before incorporating any compound into a research
            protocol.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground">4. Storage, Handling, and Reconstitution</h2>
          <p className="mt-3">
            I agree to handle, store, reconstitute, and dispose of all materials in
            accordance with applicable laboratory safety standards, manufacturer
            recommendations, and any local, state, and federal regulations governing
            research chemicals. I will follow proper sterile technique during
            reconstitution and store materials under recommended conditions
            (refrigerated 2–8 °C, light-protected).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground">5. Cost, No-Refund Policy, and No Guarantee</h2>
          <p className="mt-3">
            I understand that all sales are final once an order has shipped. Viora
            does not offer refunds, exchanges, or returns on any compounds due to
            the nature of laboratory chemicals and chain-of-custody requirements. I
            further acknowledge that Viora makes no warranties, express or implied,
            regarding fitness for a particular research purpose beyond the
            specifications stated on the published Certificate of Analysis (COA).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground">6. Voluntary Participation; No Medical Claims</h2>
          <p className="mt-3">
            My purchase and use of Viora products is entirely voluntary. Viora does
            not provide medical advice, treatment recommendations, or guidance on
            human use. Any decisions regarding the use of these compounds are made
            independently and at my own risk.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground">7. Data and Privacy</h2>
          <p className="mt-3">
            I consent to Viora's collection and processing of the personal
            information I provide for the purpose of fulfilling orders, providing
            customer support, complying with legal obligations, and improving the
            Viora platform. Viora's full Privacy Policy is incorporated by
            reference.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground">8. Adverse Event Reporting</h2>
          <p className="mt-3">
            If, despite the research-use-only nature of these products, I become
            aware of any adverse event involving Viora compounds, I agree to report
            it promptly to{" "}
            <a href="mailto:research@viorahealthcare.com" className="font-medium text-brand hover:underline">
              research@viorahealthcare.com
            </a>{" "}
            so Viora can maintain accurate batch and safety records.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground">9. Age Confirmation</h2>
          <p className="mt-3">
            I confirm that I am <strong>21 years of age or older</strong> and have
            the legal capacity to enter into this agreement. I will not transfer,
            resell, or share Viora products with any person under 21.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground">10. Acceptance</h2>
          <p className="mt-3">
            By creating an account and/or placing an order, I confirm that I have
            read, understood, and agree to be bound by every provision of this
            Research Use Consent. My acceptance is recorded with a timestamp and IP
            address for compliance audit purposes. I additionally re-confirm
            consent at every checkout before payment is processed.
          </p>
        </section>
      </div>

      <div className="mt-12 rounded-2xl border border-brand/30 bg-brand-soft p-6">
        <p className="text-sm leading-relaxed text-foreground">
          <strong>Questions?</strong> Email{" "}
          <a href="mailto:research@viorahealthcare.com" className="font-medium text-brand hover:underline">
            research@viorahealthcare.com
          </a>{" "}
          or call{" "}
          <a href="tel:+19549951406" className="font-medium text-brand hover:underline">
            +1 (954) 995-1406
          </a>
          . For institutional / bulk-purchase consent variations, contact us
          before placing an order.
        </p>
      </div>
    </div>
  );
}
