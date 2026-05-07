export const metadata = {
  title: "Privacy Policy",
  description: "How Viora Healthcare collects, uses, and protects your data.",
};

const EFFECTIVE = "May 7, 2026";

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="!mt-2 text-sm text-muted-foreground">Effective: {EFFECTIVE}</p>

      <p>
        This Privacy Policy describes how Viora Health Care (&ldquo;Viora&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects,
        uses, and protects information when you use viorahealthcare.com or related Services.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>
          <strong>Account information:</strong> name, email, phone number, and password
          (stored hashed) when you register.
        </li>
        <li>
          <strong>Order information:</strong> shipping address, billing address, items
          purchased, and order history.
        </li>
        <li>
          <strong>Payment information:</strong> processed by our PCI-compliant payment
          processor. We do <strong>not</strong> store full card numbers on our servers.
        </li>
        <li>
          <strong>Consent records:</strong> timestamps, IP address, and user agent each time
          you accept research-use, age, or terms-of-service consent — required for
          regulatory compliance.
        </li>
        <li>
          <strong>Usage data:</strong> pages viewed, clicks, device type, browser, referrer,
          and approximate location derived from IP. Used to operate and improve the
          Services.
        </li>
        <li>
          <strong>Communication:</strong> messages you send via support channels (email,
          SMS, our chat assistant) along with our responses.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>Fulfill orders, send shipping updates, and provide customer support.</li>
        <li>Send transactional emails and SMS (order confirmations, shipping, COA delivery).</li>
        <li>Maintain compliance audit trails for research-use consent.</li>
        <li>Detect, prevent, and respond to fraud or abuse.</li>
        <li>Improve product offerings, site design, and user experience.</li>
        <li>Send promotional emails — only if you&apos;ve explicitly opted in.</li>
      </ul>

      <h2>3. Sharing Your Information</h2>
      <p>We share data only with the following categories of recipients:</p>
      <ul>
        <li>
          <strong>Service providers</strong> who help us operate (payment processors,
          shipping carriers, email/SMS providers, hosting, analytics). They access only what
          they need to perform their function and are contractually obligated to protect it.
        </li>
        <li>
          <strong>Legal authorities</strong> when required by law, valid subpoena, or to
          protect rights, property, or safety.
        </li>
        <li>
          <strong>Successors in interest</strong> in the event of a merger, acquisition, or
          sale of business assets.
        </li>
      </ul>
      <p>We do <strong>not</strong> sell your personal information.</p>

      <h2>4. Cookies and Tracking</h2>
      <p>
        We use cookies for essential site functionality (cart, login session, language
        preference, research-use consent acknowledgment). We may also use first-party
        analytics cookies to understand aggregate site usage. You can disable cookies in
        your browser, though some Services will not function correctly without them.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain account information while your account is active. Order history, payment
        records, and consent logs are retained for 7 years for accounting and regulatory
        purposes. Communication transcripts are retained for 2 years. You may request
        deletion of your account at any time (see Section 7); some records will be retained
        in anonymized form to satisfy legal obligations.
      </p>

      <h2>6. Security</h2>
      <p>
        We use industry-standard technical and organizational measures to protect your data,
        including TLS for data in transit, encrypted storage at rest, access controls, and
        regular security review. No method of transmission over the Internet is 100% secure;
        we cannot guarantee absolute security.
      </p>

      <h2>7. Your Rights</h2>
      <p>Subject to applicable law, you have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Request correction of inaccurate data.</li>
        <li>Request deletion of your account and personal data.</li>
        <li>Object to or restrict certain processing.</li>
        <li>Withdraw marketing consent at any time.</li>
        <li>Receive a portable copy of your data.</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at{" "}
        <a href="mailto:hello@viorahealthcare.com">hello@viorahealthcare.com</a>. We will
        respond within 30 days.
      </p>

      <h2>8. Children</h2>
      <p>
        The Services are not directed at, and we do not knowingly collect data from, anyone
        under 21 years of age. If you believe we have inadvertently collected information
        from a minor, contact us immediately and we will delete it.
      </p>

      <h2>9. International Users</h2>
      <p>
        Viora operates from the United States. By using the Services, you consent to your
        information being processed in the U.S., which may have data-protection laws
        different from those of your country.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will be
        communicated by email or a prominent banner on the Services.
      </p>

      <h2>11. Contact</h2>
      <p>
        Privacy questions or requests:{" "}
        <a href="mailto:hello@viorahealthcare.com">hello@viorahealthcare.com</a>.
      </p>
    </>
  );
}
