import Link from "next/link";
import { notFound } from "next/navigation";
import {
  products,
  getProduct,
  STACK_PEPTIDES,
  BLEND_PEPTIDES,
} from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { ProductPhoto } from "@/components/product-photo";
import { AddToCart } from "@/components/add-to-cart";
import { ProductResearchSection } from "@/components/product-research-section";
import { getProductResearch } from "@/lib/product-research";
import { coasForProductSlug } from "@/lib/coas";
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
  const research = getProductResearch(product.slug);
  const related = products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 3);

  // Resolved COA(s) for this product. For individuals + blends this is a
  // single record; for stacks it's the component peptides' COAs (which
  // surface separately in the buy-box).
  const productCoas = coasForProductSlug(product.slug, STACK_PEPTIDES);
  const primaryCoa = productCoas[0]; // for the "View COA" button

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
        {/* Image — real photo */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-white">
            <ProductPhoto
              primary={product.image}
              alt={product.name}
              peptides={
                product.peptides ??
                STACK_PEPTIDES[product.slug] ??
                BLEND_PEPTIDES[product.slug]
              }
              className="h-full"
            />
            {product.tags.includes("Best Seller") && (
              <span className="absolute left-4 top-4 z-20 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-foreground">
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
              image={product.image}
              outOfStock={stock === "out_of_stock"}
            />
            {primaryCoa ? (
              <Link
                href={`/coa/${primaryCoa.batch}?from=${product.slug}`}
                className="flex-1 rounded-full border border-border bg-background px-6 py-3 text-center text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                {productCoas.length > 1 ? `View COAs (${productCoas.length})` : "View COA"}
              </Link>
            ) : (
              <Link
                href="/coas"
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

      {/* Multi-COA section — only renders for stacks where the customer
          gets multiple vials, each with its own batch + COA. */}
      {productCoas.length > 1 && (
        <section className="mt-16">
          <div className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand">
              Per-component analytical reports
            </div>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Every vial in this stack has its own COA
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Each peptide was tested independently by Polaris Analytical.
              Click any batch below to view the full certificate of analysis.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {productCoas.map((coa) => (
                <Link
                  key={coa.batch}
                  href={`/coa/${coa.batch}?from=${product.slug}`}
                  className="group flex flex-col rounded-xl bg-white p-4 ring-1 ring-black/[0.04] transition-all hover:-translate-y-0.5 hover:ring-black/[0.08] hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-semibold text-foreground group-hover:text-brand">
                      {coa.compound}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                      <span className="h-1 w-1 rounded-full bg-emerald-500" />
                      Pass
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {coa.batch}
                  </div>
                  <div className="mt-3 flex items-baseline justify-between text-xs">
                    <span className="text-muted-foreground">Purity</span>
                    <span className="font-semibold text-foreground">{coa.purityResult}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Per-SKU research dossier — Overview / History / Structures /
          Research Findings / References. Mirrored from lib/product-research.ts */}
      {research && (
        <ProductResearchSection data={research} productName={product.name} />
      )}

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
