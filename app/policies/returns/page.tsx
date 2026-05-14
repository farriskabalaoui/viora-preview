import { VIORA_PHONE_DISPLAY, VIORA_PHONE_HREF } from "@/lib/contact";

export const metadata = {
  title: "Returns Policy",
  description: "Viora Healthcare returns and refunds.",
};

export default function ReturnsPage() {
  return (
    <>
      <h1>Returns Policy</h1>
      <p className="!mt-2 text-sm text-muted-foreground">Effective: May 7, 2026</p>

      <h2>The short version</h2>
      <p>
        Research compounds are <strong>non-returnable and non-refundable once shipped</strong>.
        We make exceptions only for orders we shipped incorrectly or that arrived damaged.
        Below are the details.
      </p>

      <h2>1. Why we don&apos;t accept general returns</h2>
      <p>
        Once a research compound has left our facility, we cannot guarantee its temperature
        history, handling, or storage conditions. Returning compounds to inventory would
        compromise the chain of custody we provide via per-batch COAs and put other
        researchers at risk of receiving product of unknown quality. For this reason every
        sale is final once shipped.
      </p>

      <h2>2. Order changes &amp; cancellations (before shipping)</h2>
      <p>
        You can cancel or modify your order any time before it has been packed and labeled —
        usually within 1–2 hours of placing the order during business hours. Contact us
        immediately at <a href="mailto:hello@viorahealthcare.com">hello@viorahealthcare.com</a>{" "}
        or text <a href={VIORA_PHONE_HREF}>{VIORA_PHONE_DISPLAY}</a>. Once a tracking number is
        generated, the order can no longer be canceled.
      </p>

      <h2>3. Damaged on arrival</h2>
      <p>
        If your package arrives with visible damage, broken vials, or otherwise
        compromised packaging:
      </p>
      <ol>
        <li>Photograph the outer carton, the inner packaging, and the affected vials before unpacking further.</li>
        <li>Email the photos to{" "}
          <a href="mailto:hello@viorahealthcare.com">hello@viorahealthcare.com</a> within{" "}
          <strong>48 hours of delivery</strong>.</li>
        <li>We will issue a replacement at no charge — typically shipping the same business day.</li>
      </ol>

      <h2>4. Wrong product or quantity shipped</h2>
      <p>
        If we shipped the wrong compound, wrong size, or wrong quantity, contact us within
        14 days. We will ship the correct product at no cost and issue a return label for
        the incorrect product (please do not open it). No restocking fee.
      </p>

      <h2>5. Items lost in transit</h2>
      <p>
        See our <a href="/policies/shipping">Shipping Policy</a>, Section 6. We coordinate
        with the carrier and at our discretion will ship a replacement.
      </p>

      <h2>6. Refund processing</h2>
      <p>
        Approved refunds are issued to the original payment method within 5–10 business
        days. Bank processing time may add an additional 1–3 business days before the credit
        appears on your statement.
      </p>

      <h2>7. Quality concerns &amp; COA disputes</h2>
      <p>
        Every Viora batch ships with an independent third-party COA from{" "}
        <a href="https://polarisanalytical.com" target="_blank" rel="noopener noreferrer">
          Polaris Analytical
        </a>
        . If your independent testing shows results that materially diverge from the COA we
        provided, contact us with your test report — we will investigate, retest the lot,
        and refund or replace as appropriate.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about a return:{" "}
        <a href="mailto:hello@viorahealthcare.com">hello@viorahealthcare.com</a> or text{" "}
        <a href={VIORA_PHONE_HREF}>{VIORA_PHONE_DISPLAY}</a>.
      </p>
    </>
  );
}
