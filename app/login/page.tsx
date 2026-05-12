"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/products";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setSubmitting(false);
        return;
      }
      router.push(returnTo);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      if (msg.includes("Supabase env")) {
        setError("Auth service not yet configured. (Dev note: Supabase keys missing.)");
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
          Sign in
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Welcome back. Sign in to view orders and access the research catalog.
        </p>
      </div>

      {/* Prominent "new here" pill, mirroring the signup page's sign-in
          callout so users can switch modes easily either direction */}
      <div className="mt-6 rounded-full bg-muted/40 px-4 py-3 text-center text-sm">
        <span className="text-muted-foreground">New here?</span>{" "}
        <Link
          href={`/signup?returnTo=${encodeURIComponent(returnTo)}`}
          className="font-semibold text-brand hover:underline"
        >
          Create an account →
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-2xl border border-border bg-background p-6 sm:p-8"
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
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
          <Link
            href="/forgot-password"
            className="mt-2 inline-block text-xs font-medium text-brand hover:underline"
          >
            Forgot password?
          </Link>
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
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
