import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";

export const metadata = { title: "Your Account" };

export default async function AccountPage() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup?returnTo=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, phone_verified_at, consent_version")
    .eq("id", user.id)
    .maybeSingle();

  const greetingName =
    profile?.full_name?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "Researcher";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="border-b border-border pb-6">
        <div className="text-xs font-medium uppercase tracking-wider text-brand">
          Researcher Portal
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Welcome, {greetingName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card
          href="/account/orders"
          title="Orders"
          body="Track active and past orders. View tracking, batches, and COAs per shipment."
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          }
        />
        <Card
          href="/account/coa-history"
          title="COA History"
          body="Every COA for every batch you've ever ordered, downloadable as PDF."
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <polyline points="9 13 11 15 15 11" />
            </svg>
          }
        />
        <Card
          href="/account/profile"
          title="Profile & Compliance"
          body="Update contact info, view consent log, manage notification preferences."
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-background p-6">
          <h2 className="font-display text-xl font-bold text-foreground">
            Recent activity
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            No orders yet. Browse the catalog to place your first order.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            Browse compounds →
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-brand-soft p-6">
          <div className="text-xs font-medium uppercase tracking-wider text-brand">
            Loyalty Points
          </div>
          <div className="mt-2 font-display text-4xl font-bold text-foreground">
            0
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Earn 1 point per $1 spent. 100 points = $5 off your next order.
          </p>
        </div>
      </div>

      {!profile?.phone_verified_at && (
        <div className="mt-8 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Your phone isn't verified yet.{" "}
          <Link
            href={`/verify?phone=${encodeURIComponent(profile?.phone ?? "")}&returnTo=/account`}
            className="font-semibold underline"
          >
            Verify now
          </Link>{" "}
          so we can SMS shipping updates.
        </div>
      )}
    </div>
  );
}

function Card({
  href,
  title,
  body,
  icon,
}: {
  href: string;
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-foreground group-hover:text-brand">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
      <div className="mt-3 text-xs font-semibold text-brand">Open →</div>
    </Link>
  );
}
