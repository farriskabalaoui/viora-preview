import Link from "next/link";

export const metadata = { title: "Profile & Compliance" };

export default function ProfilePage() {
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
        <Section title="Contact information">
          <Field label="Email" placeholder="researcher@lab.org" />
          <Field label="Phone" placeholder="+1 (954) 555-0199" />
          <Field label="Affiliation" placeholder="Research institution / lab name" />
        </Section>

        <Section title="Shipping address">
          <Field label="Street" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="City" />
            <Field label="State" />
            <Field label="ZIP" />
          </div>
        </Section>

        <Section title="Consent log">
          <p className="text-sm text-muted-foreground">
            Your full audit trail of consent acceptances (signup + each order).
            Exportable as PDF for your records.
          </p>
          <div className="mt-3 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-xs text-muted-foreground">
            Consent history will appear here once you complete signup.
          </div>
        </Section>

        <Section title="Notification preferences">
          <Toggle label="Email me when my COAs are published" />
          <Toggle label="Email me about new compounds and batches" />
          <Toggle label="SMS me when my orders ship" />
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />
    </div>
  );
}

function Toggle({ label }: { label: string }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/20 px-4 py-3">
      <span className="text-sm text-foreground">{label}</span>
      <input type="checkbox" className="h-5 w-5 accent-brand" />
    </label>
  );
}
