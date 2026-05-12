"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

/**
 * Password reset confirmation page. Reached via the magic link sent by
 * /forgot-password. Supabase auth attaches a recovery session before this
 * page mounts (via the URL hash); we just verify a session exists, then
 * collect the new password.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState<"checking" | "ready" | "invalid">("checking");

  // Wait for Supabase to process the recovery hash before letting the user submit.
  useEffect(() => {
    (async () => {
      try {
        const supabase = getSupabaseBrowser();
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setReady("ready");
        } else {
          // Listen briefly in case Supabase is still parsing the hash
          const sub = supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
              setReady("ready");
            }
          });
          // Fail closed after 5s
          setTimeout(() => {
            setReady((current) => (current === "checking" ? "invalid" : current));
            sub.data.subscription.unsubscribe();
          }, 5000);
        }
      } catch {
        setReady("invalid");
      }
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
        setSubmitting(false);
        return;
      }
      router.push("/account?passwordReset=1");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Update failed";
      setError(msg);
      setSubmitting(false);
    }
  }

  if (ready === "checking") {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-300px)] max-w-md items-center justify-center px-4 py-12 sm:px-6">
        <p className="text-sm text-muted-foreground">Verifying your reset link...</p>
      </div>
    );
  }

  if (ready === "invalid") {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-300px)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-border bg-background p-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Reset link expired
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground hover:opacity-90"
          >
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-300px)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Set a new password
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Choose a password at least 8 characters long.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-border bg-background p-6 sm:p-8"
      >
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
            New password
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

        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
            Confirm password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
          {submitting ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}
