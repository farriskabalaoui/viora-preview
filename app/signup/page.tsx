"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/products";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [age21, setAge21] = useState(false);
  const [researchUse, setResearchUse] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allConsentsChecked = age21 && researchUse && acceptTerms;
  const formValid = email && password.length >= 8 && phone && allConsentsChecked;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formValid) return;
    setSubmitting(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        phone,
        options: {
          data: {
            age_confirmed: true,
            research_use_acknowledged: true,
            terms_accepted_at: new Date().toISOString(),
            consent_version: "v1.0",
          },
        },
      });

      if (error) {
        setError(error.message);
        setSubmitting(false);
        return;
      }

      // TODO Phase 2: trigger Twilio SMS verification step before granting access
      router.push(`/verify?returnTo=${encodeURIComponent(returnTo)}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Signup failed";
      // If Supabase env not configured, show friendly message
      if (msg.includes("Supabase env")) {
        setError(
          "Auth service not yet configured. (Dev note: Supabase keys missing from environment.)",
        );
      } else {
        setError(msg);
      }
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-300px)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Apply for Portal Access
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Researchers and clinicians only. Approval typically within 1 business day.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-border bg-background p-6 sm:p-8"
      >
        {/* Email */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@lab.org"
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
            Password (min 8 characters)
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Phone — for SMS verification (Twilio Phase 2) */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
            Phone (for verification)
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (954) 555-0199"
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            We'll send a one-time SMS code to confirm.
          </p>
        </div>

        {/* Consent checkboxes */}
        <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
          <label className="flex items-start gap-3 text-sm text-foreground/85">
            <input
              type="checkbox"
              required
              checked={age21}
              onChange={(e) => setAge21(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-none accent-brand"
            />
            <span>
              I confirm I am <strong>21 years of age or older</strong>.
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm text-foreground/85">
            <input
              type="checkbox"
              required
              checked={researchUse}
              onChange={(e) => setResearchUse(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-none accent-brand"
            />
            <span>
              I acknowledge that all products purchased from Viora are for{" "}
              <strong>in-vitro research use only</strong>. They are not for human
              consumption, diagnostic, or therapeutic use. Statements have not been
              evaluated by the FDA.
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm text-foreground/85">
            <input
              type="checkbox"
              required
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-none accent-brand"
            />
            <span>
              I have read and accept the{" "}
              <Link href="/consent" className="font-medium text-brand hover:underline" target="_blank">
                Full Research Use Consent
              </Link>{" "}
              and{" "}
              <Link href="/policies/terms" className="font-medium text-brand hover:underline" target="_blank">
                Terms of Service
              </Link>
              . I understand orders are non-refundable once shipped, and I am
              personally responsible for safe handling and disposal.
            </span>
          </label>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!formValid || submitting}
          className={`w-full rounded-full px-6 py-3 text-sm font-semibold transition ${
            !formValid || submitting
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "bg-brand text-brand-foreground hover:opacity-90"
          }`}
        >
          {submitting ? "Submitting…" : "Apply for Portal Access"}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href={`/login?returnTo=${encodeURIComponent(returnTo)}`} className="font-medium text-brand hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading…</div>}>
      <SignupForm />
    </Suspense>
  );
}
