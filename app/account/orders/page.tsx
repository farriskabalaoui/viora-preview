import Link from "next/link";

export const metadata = { title: "Your Orders" };

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <nav className="text-xs text-muted-foreground">
        <Link href="/account" className="hover:text-brand">Account</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Orders</span>
      </nav>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Your Orders
      </h1>

      {/* Empty state */}
      <div className="mt-10 rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background text-muted-foreground">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
          No orders yet
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          When you place an order, it'll show up here with tracking + COA per batch.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground hover:opacity-90"
        >
          Browse compounds
        </Link>
      </div>
    </div>
  );
}
