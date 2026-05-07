"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CoaVerifyForm() {
  const router = useRouter();
  const [batch, setBatch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const norm = batch.trim().toUpperCase();
    if (!norm) return;
    setSubmitting(true);
    setError(null);
    // Hand off to the dynamic COA page; it will 404 if no match.
    router.push(`/polaris/coa/${encodeURIComponent(norm)}`);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={batch}
        onChange={(e) => {
          setBatch(e.target.value);
          if (error) setError(null);
        }}
        placeholder="Batch number — e.g., VHC-2649801"
        className="flex-1 rounded-md border border-[#cdd5e0] bg-white px-4 py-3 text-sm outline-none focus:border-[#0a4d6f] focus:ring-1 focus:ring-[#0a4d6f]"
      />
      <button
        type="submit"
        disabled={!batch.trim() || submitting}
        className="rounded-md bg-[#0a4d6f] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Looking up…" : "Verify"}
      </button>
      {error && (
        <div className="text-xs text-rose-700">{error}</div>
      )}
    </form>
  );
}
