import { VIORA_PHONE_DISPLAY, VIORA_PHONE_HREF } from "@/lib/contact";

export const metadata = {
  title: "Terms of Service",
  description: "Viora Healthcare Terms of Service.",
};

const EFFECTIVE = "May 7, 2026";

export default function TermsPage() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p className="!mt-2 text-sm text-muted-foreground">Effective: {EFFECTIVE}</p>

      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of
        viorahealthcare.com and any associated services (the &ldquo;Services&rdquo;) operated by
        Viora Health Care (&ldquo;Viora&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the
        Services or placing an order, you agree to these Terms in full. If you do not agree,
        do not use the Services.
      </p>

      <h2>1. Research Use Only</h2>
      <p>
        All compounds offered through the Services are sold as research chemicals for{" "}
        <strong>laboratory research only</strong>. They are{" "}
        <strong>not</strong> intended for human consumption, diagnostic, therapeutic,
        cosmetic, veterinary, or any other in-vivo use. None of our products have been
        evaluated by the U.S. Food and Drug Administration (FDA). No statement made by Viora,
        on the Services, in marketing material, or in support communications is intended to
        diagnose, treat, cure, or prevent any disease.
      </p>

      <h2>2. Eligibility</h2>
      <p>You may only use the Services if all of the following are true:</p>
      <ul>
        <li>You are at least 21 years of age.</li>
        <li>You are a qualified researcher, scientist, or laboratory professional.</li>
        <li>You have read and accepted our{" "}
          <a href="/consent">Research Use Consent</a> and this Agreement.</li>
        <li>Use of research chemicals is lawful in your jurisdiction.</li>
      </ul>
      <p>
        We reserve the right to refuse service, cancel orders, or terminate accounts at our
        sole discretion if we have reason to believe any of the above is not satisfied.
      </p>

      <h2>3. Account Responsibility</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials
        and for all activity that occurs under your account. Notify us immediately at{" "}
        <a href="mailto:hello@viorahealthcare.com">hello@viorahealthcare.com</a> if you
        suspect unauthorized access.
      </p>

      <h2>4. Orders, Pricing, and Availability</h2>
      <p>
        All orders are subject to acceptance and product availability. Prices are listed in
        U.S. Dollars and may change at any time without notice. We reserve the right to
        cancel any order, including after payment, if a product is mispriced, out of stock,
        or otherwise unavailable. In such cases we will issue a full refund of the canceled
        amount.
      </p>

      <h2>5. Shipping &amp; Risk of Loss</h2>
      <p>
        See our <a href="/policies/shipping">Shipping Policy</a> for details. Title and risk
        of loss for products pass to you upon delivery to the carrier.
      </p>

      <h2>6. Returns &amp; Refunds</h2>
      <p>
        Research compounds are <strong>non-returnable and non-refundable once shipped</strong>.
        Limited exceptions for damaged or incorrect product shipments are described in our{" "}
        <a href="/policies/returns">Returns Policy</a>.
      </p>

      <h2>7. Safe Handling</h2>
      <p>
        You assume full responsibility for the safe storage, handling, use, and disposal of
        research compounds purchased from Viora, including all applicable workplace,
        environmental, and waste-disposal regulations. You agree to maintain laboratory
        conditions and personal protective equipment appropriate for the compounds you
        receive.
      </p>

      <h2>8. Compliance With Law</h2>
      <p>
        You represent that your purchase, possession, and use of any product complies with
        all applicable federal, state, and local laws and regulations. Some compounds may be
        regulated or restricted in certain jurisdictions; it is your responsibility to verify
        and comply.
      </p>

      <h2>9. Intellectual Property</h2>
      <p>
        All content on the Services — including text, images, logos, product photography,
        articles, and software — is the property of Viora or its licensors and is protected
        by U.S. and international intellectual property laws. You may not reproduce,
        distribute, or create derivative works without prior written permission.
      </p>

      <h2>10. Disclaimer of Warranties</h2>
      <p>
        THE SERVICES AND ALL PRODUCTS ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
        WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED
        WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
        NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR
        ERROR-FREE.
      </p>

      <h2>11. Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, VIORA SHALL NOT BE LIABLE FOR ANY INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN
        CONNECTION WITH YOUR USE OF THE SERVICES OR ANY PRODUCT. OUR TOTAL CUMULATIVE
        LIABILITY FOR ANY CLAIM SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SPECIFIC
        PRODUCT GIVING RISE TO THE CLAIM.
      </p>

      <h2>12. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless Viora and its officers, directors,
        employees, and agents from any claims, damages, losses, or expenses (including
        reasonable attorneys&apos; fees) arising out of (a) your misuse of any product, (b) your
        violation of these Terms, (c) your violation of any law, or (d) any in-vivo or
        non-research use of products purchased.
      </p>

      <h2>13. Governing Law &amp; Dispute Resolution</h2>
      <p>
        These Terms are governed by the laws of the State of Florida, without regard to
        conflict-of-laws principles. Any dispute arising out of or relating to these Terms
        or the Services shall be resolved exclusively in the state or federal courts
        located in Broward County, Florida.
      </p>

      <h2>14. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will be communicated
        via email or a banner on the Services. Continued use after changes are posted
        constitutes acceptance of the revised Terms.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions about these Terms can be sent to{" "}
        <a href="mailto:hello@viorahealthcare.com">hello@viorahealthcare.com</a> or by text
        at <a href={VIORA_PHONE_HREF}>{VIORA_PHONE_DISPLAY}</a>.
      </p>
    </>
  );
}
