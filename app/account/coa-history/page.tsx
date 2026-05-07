import Link from "next/link";

export const metadata = { title: "COA History" };

export default function COAHistoryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <nav className="text-xs text-muted-foreground">
        <Link href="/account" className="hover:text-brand">Account</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">COA History</span>
      </nav>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        COA History
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Every Certificate of Analysis for every batch you've ever received from
        Viora. Search by compound, batch number, or date. Download as PDF.
      </p>

      <div className="mt-10 rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background text-muted-foreground">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
          No COAs yet
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          COAs for your future orders will appear here. Public sample COAs are
          available on the Lab Testing page.
        </p>
        <Link
          href="/research#coa"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground hover:opacity-90"
        >
          View public sample COAs
        </Link>
      </div>
    </div>
  );
}
