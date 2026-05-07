"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Per-order checkout consent (per Khaled's requirement).
 *
 * Renders before the final payment confirmation.
 * - Submit/Pay button is disabled until checked
 * - Each consent click is logged to the order record
 *   (timestamp + IP + consent version) via /api/consent-log
 *
 * Usage:
 *   <CheckoutConsent
 *     onConsent={(consented) => setReadyToPay(consented)}
 *   />
 */
export function CheckoutConsent({
  onConsent,
}: {
  onConsent?: (consented: boolean) => void;
}) {
  const [consented, setConsented] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setConsented(checked);
    onConsent?.(checked);

    // Log consent click (fire-and-forget; non-blocking)
    if (checked) {
      fetch("/api/consent-log", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          consent_version: "v1.0",
          stage: "checkout",
          ts: new Date().toISOString(),
        }),
      }).catch(() => {
        /* don't block UX on a logging failure */
      });
    }
  }

  return (
    <div className="rounded-2xl border-2 border-brand/30 bg-brand-soft p-5">
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          required
          checked={consented}
          onChange={handleChange}
          className="mt-1 h-5 w-5 flex-none accent-brand"
        />
        <div className="text-sm leading-relaxed text-foreground">
          <strong className="font-semibold">I consent to this order.</strong>{" "}
          I confirm this purchase is for in-vitro research use only, that I am
          21+, and that I accept the{" "}
          <Link
            href="/consent"
            target="_blank"
            className="font-medium text-brand hover:underline"
          >
            Viora Research Use Consent
          </Link>{" "}
          and{" "}
          <Link
            href="/policies/terms"
            target="_blank"
            className="font-medium text-brand hover:underline"
          >
            Terms of Service
          </Link>
          . I understand orders are non-refundable once shipped.
        </div>
      </label>
      <p className="mt-3 ml-8 text-[11px] text-muted-foreground">
        Required before payment. Each consent is logged with timestamp and IP
        for compliance audit.
      </p>
    </div>
  );
}
