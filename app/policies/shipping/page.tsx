import { VIORA_PHONE_DISPLAY, VIORA_PHONE_HREF } from "@/lib/contact";

export const metadata = {
  title: "Shipping Policy",
  description: "How and where Viora Healthcare ships research compounds.",
};

export default function ShippingPage() {
  return (
    <>
      <h1>Shipping Policy</h1>
      <p className="!mt-2 text-sm text-muted-foreground">Effective: May 7, 2026</p>

      <p>
        All Viora orders ship from our U.S. facility via discreet packaging — exterior
        labels do not reference the contents. Cold-chain compounds are packed with insulated
        liners and ice packs as needed.
      </p>

      <h2>1. Where We Ship</h2>
      <p>
        We currently ship to all 50 U.S. states, plus U.S. territories (Puerto Rico, Guam,
        U.S. Virgin Islands). International shipping is not available at this time.
      </p>

      <h2>2. Processing Time</h2>
      <p>
        Orders placed before <strong>2:00 PM ET, Monday–Friday</strong> are typically
        processed and shipped the same business day. Orders placed after the cutoff or on
        weekends ship the next business day. You will receive an order-confirmation email
        immediately and a separate shipping email with tracking when your package leaves our
        facility.
      </p>

      <h2>3. Delivery Times</h2>
      <ul>
        <li><strong>Standard (USPS Priority):</strong> 2–3 business days, included free on orders over $100.</li>
        <li><strong>Expedited (UPS 2nd Day Air):</strong> 2 business days, $14.95 flat.</li>
        <li><strong>Overnight (UPS Next Day Air):</strong> 1 business day, $34.95 flat.</li>
      </ul>
      <p className="text-sm text-muted-foreground">
        Delivery times are estimates and not guaranteed. Weather, peak season, and carrier
        delays may extend transit. We do not refund shipping for late deliveries unless we
        explicitly guaranteed a delivery date in writing.
      </p>

      <h2>4. Tracking</h2>
      <p>
        Tracking numbers appear in your account portal at{" "}
        <a href="/account/orders">/account/orders</a> and are sent via email + SMS the
        moment the carrier scans your package.
      </p>

      <h2>5. Signature on Delivery</h2>
      <p>
        Orders over $250 require an adult signature (21+) on delivery. This protects against
        package theft and confirms receipt by an eligible researcher. If no one is available
        to sign, the carrier will leave a notice and reattempt.
      </p>

      <h2>6. Lost, Stolen, or Damaged Packages</h2>
      <p>
        If your tracking shows &ldquo;delivered&rdquo; but the package has not arrived, please:
      </p>
      <ol>
        <li>Check with neighbors, building managers, and other household members.</li>
        <li>Contact the carrier directly with your tracking number to file a claim.</li>
        <li>Email us at{" "}
          <a href="mailto:hello@viorahealthcare.com">hello@viorahealthcare.com</a> within
          14 days. We will help reconcile the carrier claim and, at our discretion, ship a
          replacement at no charge.
        </li>
      </ol>
      <p>
        Damaged packages: photograph the outer packaging and the contents within 48 hours of
        delivery and email the photos to us. We will replace damaged units at no cost.
      </p>

      <h2>7. Address Errors</h2>
      <p>
        Verify your shipping address carefully at checkout. Address corrections after the
        package has shipped are at the carrier&apos;s discretion and may incur a fee. Returned
        packages due to incorrect addresses can be reshipped at the customer&apos;s expense.
      </p>

      <h2>8. Storage on Arrival</h2>
      <p>
        Lyophilized peptides are stable at room temperature during transit. On arrival,
        store unreconstituted product at –20 °C (long-term) or 2–8 °C (short-term).
        Reconstituted product should be used within 14 days when stored at 2–8 °C. See
        each product&apos;s COA and the in-product handling guide for compound-specific
        guidance.
      </p>

      <h2>9. Questions</h2>
      <p>
        Email <a href="mailto:hello@viorahealthcare.com">hello@viorahealthcare.com</a> or
        text <a href={VIORA_PHONE_HREF}>{VIORA_PHONE_DISPLAY}</a>.
      </p>
    </>
  );
}
