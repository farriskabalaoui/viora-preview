import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { products, categories } from "@/lib/products";
import { getStockMap } from "@/lib/ecwid-sync";
import { stockStatusFor, type StockStatus } from "@/lib/stock";

type Props = {
  searchParams: Promise<{ category?: string; tag?: string }>;
};

// Re-pull Ecwid stock at most once per minute on the edge.
export const revalidate = 60;

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const activeCategory = sp.category;
  const activeTag = sp.tag;

  let filtered = products;
  if (activeCategory) {
    filtered = filtered.filter((p) => p.category === activeCategory);
  }
  if (activeTag) {
    filtered = filtered.filter((p) => p.tags.includes(activeTag));
  }

  // Live stock overlay from Ecwid. If Ecwid is misconfigured/down, this
  // returns an empty map and each card falls back to its local stub.
  const ecwidStock = await getStockMap(
    products.map((p) => ({ slug: p.slug, name: p.name })),
  );
  const stockBySlug = new Map<string, StockStatus>();
  for (const p of products) {
    const live = ecwidStock.get(p.slug);
    if (!live) {
      stockBySlug.set(p.slug, stockStatusFor(p.slug));
      continue;
    }
    if (!live.inStock) stockBySlug.set(p.slug, "out_of_stock");
    else if (live.quantity !== null && live.quantity <= 5)
      stockBySlug.set(p.slug, "low_stock");
    else stockBySlug.set(p.slug, "in_stock");
  }

  const tagsInCatalog = Array.from(new Set(products.flatMap((p) => p.tags)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="border-b border-border pb-8">
        <div className="text-xs font-medium uppercase tracking-wider text-brand">
          Catalog
        </div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Research Compounds
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Every compound is HPLC-verified and shipped from our U.S. facility. For
          research use only.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <FilterChip href="/products" active={!activeCategory && !activeTag}>
          All
        </FilterChip>
        {categories.map((cat) => (
          <FilterChip
            key={cat}
            href={`/products?category=${cat}`}
            active={activeCategory === cat}
          >
            {cat === "Stack"
              ? "Stacks"
              : cat === "Blend"
                ? "Blends"
                : "Single Peptides"}
          </FilterChip>
        ))}
        <span className="mx-2 self-center text-muted-foreground">·</span>
        {tagsInCatalog.slice(0, 8).map((tag) => (
          <FilterChip
            key={tag}
            href={`/products?tag=${encodeURIComponent(tag)}`}
            active={activeTag === tag}
          >
            {tag}
          </FilterChip>
        ))}
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.slug} product={p} stock={stockBySlug.get(p.slug)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          No products match these filters yet.
        </div>
      )}
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
        active
          ? "border-brand bg-brand text-brand-foreground"
          : "border-border bg-background text-muted-foreground hover:border-brand/50 hover:text-brand"
      }`}
    >
      {children}
    </Link>
  );
}
