import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Vial, vialVariantFor } from "@/components/vial";
import { AddToCart } from "@/components/add-to-cart";
import { stockStatusFor, stockLabel } from "@/lib/stock";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.short,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const stock = stockStatusFor(product.slug);
  const related = products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 3);

  const coaMap: Record<string, string> = {
    tesamorelin: "/coas/Tesamorelin-purity.pdf",
    "mots-c": "/coas/MOTS-c-purity.pdf",
    "ghk-cu": "/coas/GHK-Cu-purity.pdf",
    "glp-3-reta": "/coas/Retatrutide-purity.pdf",
  };
  const coaFile = coaMap[product.slug];

  const stockBadgeClass =
    stock === "in_stock"
      ? "bg-emerald-50 text-emerald-700"
      : stock === "low_stock"
        ? "bg-amber-50 text-amber-800"
        : "bg-rose-50 text-rose-700";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-brand">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image — Vial illustration */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-muted">
            <Vial variant={vialVariantFor(product.category)} className="h-full w-full" />
            {product.tags.includes("Best Seller") && (
              <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-foreground">
                Best Seller
              </span>
            )}
          </div>
        </div>

        {/* Detail */}
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">
              {product.category === "Stack"
                ? "Pre-Built Stack"
                : product.category === "Blend"
                  ? "Peptide Blend"
                  : "Single Peptide"}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${stockBadgeClass}`}>
              {stockLabel(stock)}
            </span>
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3">
            <span className="text-3xl font-semibold text-foreground">
              ${product.priceFrom}
              {product.priceMax && (
                <span className="text-base text-muted-foreground"> – ${product.priceMax}</span>
              )}
            </span>
            <span className="text-sm text-muted-foreground">research grade</span>
          </div>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {product.long}
          </p>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 1 && (
            <div className="mt-6">
              <div className="text-xs font-medium uppercase tracking-wider text-foreground/70">
                Available Sizes
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <div
                    key={s.mg}
                    className="rounded-xl border border-border bg-background px-4 py-3"
                  >
                    <div className="text-sm font-semibold text-foreground">{s.mg} mg</div>
                    <div className="text-xs text-muted-foreground">${s.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specs */}
          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-muted/40 p-5 text-sm">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Purity
              </div>
              <div className="mt-1 font-semibold text-foreground">{product.purity}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Form
              </div>
              <div className="mt-1 font-semibold text-foreground">Lyophilized powder</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Origin
              </div>
              <div className="mt-1 font-semibold text-foreground">Manufactured & Packed in U.S.</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Verification
              </div>
              <div className="mt-1 font-semibold text-foreground">HPLC + Mass Spec</div>
            </div>
          </div>

          {/* Add to Cart + COA */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <AddToCart
              slug={product.slug}
              name={product.name}
              priceFrom={product.priceFrom}
              outOfStock={stock === "out_of_stock"}
            />
            {coaFile ? (
              <a
                href={coaFile}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-full border border-border bg-background px-6 py-3 text-center text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                View COA ↗
              </a>
            ) : (
              <Link
                href="/research#coa"
                className="flex-1 rounded-full border border-border bg-background px-6 py-3 text-center text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                Lab Testing Info
              </Link>
            )}
          </div>

          <div className="mt-5 rounded-xl border border-border bg-brand-soft p-4 text-xs leading-relaxed text-brand-soft-foreground">
            <strong>For research use only.</strong> Not for human consumption,
            diagnostic or therapeutic use. Researcher must be 21+ and acknowledge all
            applicable compliance requirements at checkout.
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20 border-t border-border pt-12">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            You may also research
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
