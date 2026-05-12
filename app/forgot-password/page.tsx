"use client";

import Link from "next/link";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowser();
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : "/reset-password";
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) {
        setError(error.message);
        setSubmitting(false);
        return;
      }
      setSent(true);
      setSubmitting(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Request failed";
      if (msg.includes("Supabase env")) {
        setError("Auth service not yet configured.");
      } else {
        setError(msg);
      }
      setSubmitting(false);
    }
  }

  async function resend() {
    if (!email) return;
    setSubmitting(true);
    try {
      const supabase = getSupabaseBrowser();
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : "/reset-password";
      await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    } catch {
      // Silent — the success UI is already shown
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-300px)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-border bg-background p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground">
            Check your inbox
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            If an account exists for <strong className="text-foreground">{email}</strong>,
            we&apos;ve sent a password reset link. It expires in 1 hour.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Didn&apos;t see it? Check spam folder first. Otherwise:
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={resend}
              disabled={submitting}
              className="rounded-full border border-border bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
            >
              {submitting ? "Resending..." : "Resend email"}
            </button>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="text-xs text-muted-foreground hover:text-brand"
            >
              Try a different email
            </button>
          </div>
          <Link
            href="/login"
            className="mt-6 inline-block text-sm font-medium text-brand hover:underline"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-300px)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Reset your password
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter the email on your researcher account. We&apos;ll send a secure
          reset link.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-border bg-background p-6 sm:p-8"
      >
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

        {error && (
          <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send reset link"}
        </button>

        <div className="text-center text-sm">
          <Link href="/login" className="font-medium text-brand hover:underline">
            ← Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
