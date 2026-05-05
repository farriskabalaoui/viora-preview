import Link from "next/link";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-brand">
            Contact
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Talk to our research team.
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Questions about a compound, batch COAs, or portal access? Drop us a note —
            our team typically replies within one business day.
          </p>

          <div className="mt-8 space-y-5 rounded-2xl border border-border bg-muted/40 p-6">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </div>
              <div className="mt-1 font-semibold">research@viorahealthcare.com</div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                General Inquiries
              </div>
              <div className="mt-1 font-semibold">hello@viorahealthcare.com</div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Hours
              </div>
              <div className="mt-1 font-semibold">Mon – Fri · 9am – 6pm ET</div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Headquarters
              </div>
              <div className="mt-1 font-semibold">United States</div>
            </div>
          </div>

          <div className="mt-6 text-xs leading-relaxed text-muted-foreground">
            For affiliate inquiries, see our{" "}
            <Link href="/affiliate" className="text-brand underline">
              affiliate program
            </Link>
            .
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-background p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Send a message</h2>
          <form
            action="/api/contact"
            method="post"
            className="mt-5 space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
            </div>
            <Field label="Organization (optional)" name="organization" />
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
                Topic
              </label>
              <select
                name="topic"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              >
                <option>Portal access application</option>
                <option>Product question</option>
                <option>Bulk / institutional order</option>
                <option>Affiliate inquiry</option>
                <option>General</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                required
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand"
                placeholder="Tell us about your research interest…"
              />
            </div>
            <label className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <input type="checkbox" required className="mt-0.5 accent-brand" />
              I confirm I am 21+ and that any orders I place are strictly for research
              and not for human consumption.
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
            >
              Send message
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              We reply within one business day.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />
    </div>
  );
}
