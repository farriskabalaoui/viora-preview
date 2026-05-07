import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

export const metadata = { title: "Profile & Compliance" };

export default async function ProfilePage() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup?returnTo=/account/profile");

  const [{ data: profile }, { data: consents }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, phone, phone_verified_at")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("consent_log")
      .select("stage, consent_version, created_at, ip_address, payload")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const initial = {
    email: user.email ?? "",
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? user.phone ?? "",
    affiliation: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="text-xs text-muted-foreground">
        <Link href="/account" className="hover:text-brand">Account</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Profile & Compliance</span>
      </nav>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Profile & Compliance
      </h1>

      <div className="mt-10 space-y-6">
        <ProfileForm initial={initial} userId={user.id} />

        <div className="rounded-2xl border border-border bg-background p-6">
          <h2 className="font-display text-lg font-bold text-foreground">
            Consent log
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Audit trail of every consent acceptance. Append-only. Exportable as
            PDF for your records.
          </p>
          {consents && consents.length > 0 ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 font-medium">Stage</th>
                    <th className="px-4 py-2 font-medium">Version</th>
                    <th className="px-4 py-2 font-medium">When</th>
                    <th className="px-4 py-2 font-medium">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {consents.map((c, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 text-foreground">{c.stage}</td>
                      <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                        {c.consent_version}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {new Date(c.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                        {c.ip_address ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-xs text-muted-foreground">
              No consent events recorded yet.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-background p-6">
          <h2 className="font-display text-lg font-bold text-foreground">
            Phone verification
          </h2>
          {profile?.phone_verified_at ? (
            <p className="mt-2 text-sm text-emerald-700">
              ✓ Phone verified on{" "}
              {new Date(profile.phone_verified_at).toLocaleDateString()}.
            </p>
          ) : (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                Verify your phone so we can SMS you shipping updates.
              </p>
              <Link
                href={`/verify?phone=${encodeURIComponent(profile?.phone ?? "")}&returnTo=/account/profile`}
                className="mt-3 inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground hover:opacity-90"
              >
                Send verification code
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
