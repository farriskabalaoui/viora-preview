"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

function Verify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/products";
  const phone = searchParams.get("phone") ?? "";

  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resentAt, setResentAt] = useState<number | null>(null);
  const sentOnceRef = useRef(false);

  // Auto-send the first code on mount if phone is present and we haven't yet
  useEffect(() => {
    if (!phone || sentOnceRef.current) return;
    sentOnceRef.current = true;
    fetch("/api/verify/start", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phone }),
    }).catch(() => {});
  }, [phone]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6 || !phone) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/verify/check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Code didn't match. Try again.");
        setSubmitting(false);
        return;
      }
      setSuccess(true);
      setSubmitting(false);
      // Brief pause so the user sees the success state before bouncing
      setTimeout(() => router.push(returnTo), 1200);
    } catch {
      setError("Network error. Try again.");
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (!phone || resending) return;
    setResending(true);
    setError(null);
    try {
      const res = await fetch("/api/verify/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) {
        const j = await res.json();
        setError(j.error ?? "Couldn't resend code.");
      } else {
        setResentAt(Date.now());
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setResending(false);
    }
  }

  // Phone-less fallback: just show static "check your email" copy
  if (!phone) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-300px)] max-w-md flex-col justify-center px-4 py-12 text-center sm:px-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12.5l-10 7L2 12.5l10-9 10 9z" />
            <path d="M2 12.5v7l10 7 10-7v-7" />
          </svg>
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground">
          Check your inbox
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          We sent a verification email. Click the link to activate your account.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Didn't get it?{" "}
          <Link href="/contact" className="font-medium text-brand hover:underline">
            Contact support
          </Link>
          .
        </p>
      </div>
    );
  }

  const masked = phone.startsWith("+1")
    ? `+1 ••• ${phone.slice(-4)}`
    : `${phone.slice(0, 3)} ••• ${phone.slice(-4)}`;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-300px)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="text-center">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
            success ? "bg-emerald-100 text-emerald-700" : "bg-brand-soft text-brand"
          }`}
        >
          {success ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
            </svg>
          )}
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground">
          {success ? "You're verified" : "Verify your phone"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {success ? (
            <>Phone confirmed. Redirecting you now…</>
          ) : (
            <>We texted a 6-digit code to <span className="font-mono">{masked}</span>.</>
          )}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`mt-8 space-y-5 rounded-2xl border border-border bg-background p-6 sm:p-8 ${success ? "pointer-events-none opacity-50" : ""}`}
      >
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="••••••"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        />

        {error && (
          <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={code.length !== 6 || submitting}
          className={`w-full rounded-full px-6 py-3 text-sm font-semibold transition ${
            code.length !== 6 || submitting
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "bg-brand text-brand-foreground hover:opacity-90"
          }`}
        >
          {submitting ? "Verifying…" : "Verify"}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Didn't get it?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-brand hover:underline disabled:opacity-50"
          >
            {resending ? "Sending…" : "Resend code"}
          </button>
          {resentAt && <span className="ml-1 text-emerald-700">— sent.</span>}
        </p>
      </form>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading…</div>}>
      <Verify />
    </Suspense>
  );
}
