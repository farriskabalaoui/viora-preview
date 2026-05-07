"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const COOKIE_NAME = "viora_research_consent";
const COOKIE_VERSION = "v1";
const COOKIE_DAYS = 90;

function setCookie(name: string, value: string, days: number) {
  const exp = new Date(Date.now() + days * 86400_000).toUTCString();
  document.cookie = `${name}=${value}; expires=${exp}; path=/; samesite=lax`;
}

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

/**
 * One-time first-visit research/age confirmation gate. Shown to brand-new
 * visitors of viora* hosts; remembered for 90 days via cookie. Skipped on
 * the Polaris site, signup/login/consent pages (already gated content),
 * and the /growth admin tree.
 */
export function ResearchGate() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [age21, setAge21] = useState(false);
  const [research, setResearch] = useState(false);

  useEffect(() => {
    if (!shouldShowOn(pathname)) return;
    if (getCookie(COOKIE_NAME) === COOKIE_VERSION) return;
    // Defer so SSR-rendered content paints first
    const t = setTimeout(() => setOpen(true), 250);
    return () => clearTimeout(t);
  }, [pathname]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const both = age21 && research;

  function accept() {
    if (!both) return;
    setCookie(COOKIE_NAME, COOKIE_VERSION, COOKIE_DAYS);
    // Fire-and-forget: log the click (non-authed) for compliance trail
    fetch("/api/consent-log", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        stage: "first_visit",
        consent_version: COOKIE_VERSION,
        age_confirmed: true,
        research_use_acknowledged: true,
      }),
    }).catch(() => {});
    setOpen(false);
  }

  function decline() {
    // Send the visitor to a clearly off-ramp page. Open Google as a hard
    // exit — they're explicitly saying they don't qualify.
    window.location.href = "https://www.google.com/";
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="research-gate-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-background shadow-2xl">
        <div className="border-b border-border px-6 py-5 sm:px-8">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Research Use Only
          </div>
          <h2
            id="research-gate-title"
            className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground"
          >
            Before you enter
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Viora supplies research compounds for in-vitro laboratory use only.
            Please confirm the following before continuing.
          </p>
        </div>

        <div className="space-y-4 px-6 py-5 sm:px-8">
          <label className="flex items-start gap-3 text-sm text-foreground/85">
            <input
              type="checkbox"
              checked={age21}
              onChange={(e) => setAge21(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-none accent-brand"
            />
            <span>
              I am <strong>21 years of age or older</strong>.
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm text-foreground/85">
            <input
              type="checkbox"
              checked={research}
              onChange={(e) => setResearch(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-none accent-brand"
            />
            <span>
              I acknowledge that all products are for{" "}
              <strong>in-vitro research use only</strong> — not for human
              consumption, diagnostic, or therapeutic use. Statements have not
              been evaluated by the FDA.
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-2 border-t border-border px-6 py-5 sm:flex-row-reverse sm:gap-3 sm:px-8">
          <button
            type="button"
            onClick={accept}
            disabled={!both}
            className={`w-full rounded-full px-5 py-2.5 text-sm font-semibold transition sm:w-auto ${
              both
                ? "bg-brand text-brand-foreground hover:opacity-90"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            }`}
          >
            Enter site
          </button>
          <button
            type="button"
            onClick={decline}
            className="w-full rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:border-brand hover:text-brand sm:w-auto"
          >
            I don&apos;t qualify
          </button>
        </div>

        <p className="border-t border-border px-6 py-4 text-[11px] leading-relaxed text-muted-foreground sm:px-8">
          By entering you accept Viora&apos;s{" "}
          <Link href="/policies/terms" className="text-brand underline">
            Terms
          </Link>{" "}
          and acknowledge our full{" "}
          <Link href="/consent" className="text-brand underline">
            Research Use Consent
          </Link>
          . You can revisit this notice from any account page.
        </p>
      </div>
    </div>
  );
}

function shouldShowOn(pathname: string | null): boolean {
  if (!pathname) return true;
  // Skip on auth pages (already gating + consent flow live), Polaris brand,
  // growth admin, and the consent doc itself.
  const skip = ["/signup", "/login", "/verify", "/consent", "/polaris", "/growth"];
  return !skip.some((p) => pathname === p || pathname.startsWith(p + "/"));
}
