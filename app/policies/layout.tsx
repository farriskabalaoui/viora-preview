import Link from "next/link";

const POLICIES = [
  { href: "/policies/terms", label: "Terms of Service" },
  { href: "/policies/privacy", label: "Privacy Policy" },
  { href: "/policies/shipping", label: "Shipping Policy" },
  { href: "/policies/returns", label: "Returns Policy" },
];

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="text-xs font-medium uppercase tracking-wider text-brand">
            Legal
          </div>
          <nav className="mt-3 flex flex-col gap-1.5">
            {POLICIES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-muted/40 hover:text-brand"
              >
                {p.label}
              </Link>
            ))}
          </nav>
          <p className="mt-6 px-3 text-xs leading-relaxed text-muted-foreground">
            Questions about any policy? Email{" "}
            <a
              href="mailto:hello@viorahealthcare.com"
              className="font-medium text-brand hover:underline"
            >
              hello@viorahealthcare.com
            </a>
          </p>
        </aside>
        <article className="prose prose-neutral max-w-none lg:col-span-9 prose-headings:font-display prose-headings:text-foreground prose-h1:text-4xl prose-h1:font-bold prose-h1:tracking-tight prose-h2:mt-10 prose-h2:text-xl prose-h2:font-bold prose-p:text-foreground/85 prose-p:leading-relaxed prose-li:text-foreground/85 prose-strong:text-foreground prose-a:text-brand">
          {children}
        </article>
      </div>
    </div>
  );
}
