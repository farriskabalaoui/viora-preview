import Link from "next/link";

/**
 * Sign-in gate component. Shown to non-authenticated users hitting
 * protected pages (product detail, cart, checkout, account).
 *
 * Currently the middleware redirects directly to /signup?returnTo=...
 * before this component renders, so this is kept as a fallback / for
 * inline contexts (e.g. embedded "sign in to see price" placeholders).
 *
 * Per Marv's 2026-05-12 feedback, both Sign In and Create Account
 * are equally prominent — neither is gated as the "only" path.
 */
export function AuthWall({ returnTo }: { returnTo?: string }) {
  const signupHref = returnTo
    ? `/signup?returnTo=${encodeURIComponent(returnTo)}`
    : "/signup";
  const loginHref = returnTo
    ? `/login?returnTo=${encodeURIComponent(returnTo)}`
    : "/login";
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Sign in to continue
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Viora products are sold strictly for laboratory research use to
        verified researchers and clinicians. Sign in to your account, or
        create one in under a minute.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href={loginHref}
          className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          Sign in
        </Link>
        <Link
          href={signupHref}
          className="inline-flex items-center justify-center rounded-full border border-border bg-background px-7 py-3 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
        >
          Create an account
        </Link>
      </div>
      <p className="mt-8 text-xs text-muted-foreground">
        Compliance: 21+ only · Research use only · Not for human consumption ·
        Statements not evaluated by FDA
      </p>
    </div>
  );
}
