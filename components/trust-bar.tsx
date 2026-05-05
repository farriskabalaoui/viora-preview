const items = [
  {
    title: "Third-Party Tested",
    body: "Every batch independently verified by accredited labs — HPLC + mass spec.",
  },
  {
    title: "Doctor-Backed",
    body: "Sourcing and quality reviewed by licensed physicians and PhD chemists.",
  },
  {
    title: "Fast U.S. Shipping",
    body: "Discreet, temperature-controlled fulfillment from our U.S. facility.",
  },
  {
    title: "Secure Portal",
    body: "256-bit encrypted client portal with HIPAA-aware data handling.",
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-6 px-4 py-10 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 flex-none rounded-full bg-brand" />
            <div>
              <div className="text-sm font-semibold text-foreground">{it.title}</div>
              <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {it.body}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
