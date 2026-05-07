"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Verify() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/products";

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
        We sent a verification email. Click the link in that email to activate
        your account, then you'll be redirected back to{" "}
        <span className="font-mono text-xs">{returnTo}</span>.
      </p>
      <p className="mt-4 text-xs text-muted-foreground">
        Didn't get it? Check your spam folder, or{" "}
        <Link href="/contact" className="font-medium text-brand hover:underline">
          contact support
        </Link>
        .
      </p>
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
