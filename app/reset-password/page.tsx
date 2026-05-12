"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

/**
 * Password reset confirmation page. Reached via the magic link sent by
 * /forgot-password. Supabase auth attaches a recovery session before this
 * page mounts (via the URL hash); we verify a session exists, then collect
 * the new password.
 *
 * Robust against:
 * - Race between client init and hash parse (waits for PASSWORD_RECOVERY)
 * - User landing here without a hash at all (shows "expired" state)
 * - Supabase config errors (shows the actual underlying error)
 * - User already logged in (recovery session still wins)
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readyState, setReadyState] = useState<
    "checking" | "ready" | "invalid"
  >("checking");
  const [detailedError, setDetailedError] = useState<string | null>(null);

  // Wait for Supabase to process the recovery hash before letting the user
  // submit. Three success signals:
  // 1. getSession() already returns a session (hash was processed pre-mount)
  // 2. PASSWORD_RECOVERY event fires (the canonical recovery signal)
  // 3. SIGNED_IN event fires with an aud=recovery (fallback)
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const start = async () => {
      try {
        const supabase = getSupabaseBrowser();

        // Surface any URL-level error from Supabase (e.g. "OTP expired",
        // "Email link is invalid or has expired"). Supabase puts these in
        // the hash too: #error=access_denied&error_code=otp_expired&error_description=...
        if (typeof window !== "undefined" && window.location.hash) {
          const hashParams = new URLSearchParams(
            window.location.hash.replace(/^#/, ""),
          );
          const urlErr = hashParams.get("error_description");
          if (urlErr) {
            setDetailedError(decodeURIComponent(urlErr.replace(/\+/g, " ")));
            setReadyState("invalid");
            return;
          }
        }

        // Subscribe FIRST so we don't miss the PASSWORD_RECOVERY event
        const sub = supabase.auth.onAuthStateChange((event) => {
          if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
            setReadyState("ready");
          }
        });
        unsubscribe = () => sub.data.subscription.unsubscribe();

        // Then check if a session already exists (hash parsed pre-mount)
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setReadyState("ready");
          return;
        }

        // No session yet, no hash error — give the auth client up to 8s to
        // parse and attach the recovery session. If nothing arrives by then,
        // the link is bad or expired.
        timeoutId = setTimeout(() => {
          setReadyState((current) => {
            if (current === "checking") {
              setDetailedError(
                "We didn't receive a valid recovery session. The link may have expired or been used already. Request a new one.",
              );
              return "invalid";
            }
            return current;
          });
        }, 8000);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Auth unavailable";
        setDetailedError(msg);
        setReadyState("invalid");
      }
    };

    start();

    return () => {
      if (unsubscribe) unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
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
      // Success — kick them into the account portal with a flash flag
      router.push("/account?passwordReset=1");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Update failed";
      setError(msg);
      setSubmitting(false);
    }
  }

  if (readyState === "checking") {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-300px)] max-w-md flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <svg
            className="h-4 w-4 animate-spin text-brand"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Verifying your reset link...
        </div>
      </div>
    );
  }

  if (readyState === "invalid") {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-300px)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-border bg-background p-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Reset link expired
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {detailedError ??
              "This password reset link is invalid or has expired. Please request a new one."}
          </p>
          <Link
            href="/forgot-password"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground hover:opacity-90"
          >
            Request new link
          </Link>
          <div className="mt-4">
            <Link
              href="/login"
              className="text-xs text-muted-foreground hover:text-brand"
            >
              ← Back to sign in
            </Link>
          </div>
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
            autoComplete="new-password"
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
            autoComplete="new-password"
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
