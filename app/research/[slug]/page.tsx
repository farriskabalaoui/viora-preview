import Link from "next/link";
import { notFound } from "next/navigation";
import {
  articles,
  getArticle,
  articleHeroImage,
  articleHeroPeptides,
  type ArticleSection,
  type Reference,
} from "@/lib/articles";
import { getProduct } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { ProductPhoto } from "@/components/product-photo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = articles
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 3);

  const relatedProducts = (article.relatedProductSlugs ?? [])
    .map((s) => getProduct(s))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground">
          <Link href="/" className="hover:text-brand">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/research" className="hover:text-brand">
            Research Library
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{article.title}</span>
        </nav>

        {/* Header */}
        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-brand-soft px-2.5 py-1 font-semibold text-brand">
              {article.category}
            </span>
            {article.inProgress && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-900">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-600" />
                </span>
                Study in progress
              </span>
            )}
            <span className="text-muted-foreground">
              {article.inProgress ? "Started " : ""}
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {article.readMinutes} min read
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        </header>

        {/* Hero image */}
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(31,38,71,0.04),0_20px_40px_-12px_rgba(31,38,71,0.14)] ring-1 ring-black/[0.04]">
          <ProductPhoto
            primary={articleHeroImage(article)}
            alt={article.title}
            peptides={articleHeroPeptides(article) ?? undefined}
            className="h-full"
          />
        </div>

        {/* Body */}
        <div className="prose-content mt-10">
          {article.body.map((section, i) => (
            <Section key={i} section={section} />
          ))}
        </div>

        {/* References */}
        {article.references && article.references.length > 0 && (
          <section className="mt-16 rounded-2xl border border-border bg-muted/40 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-foreground">References</h2>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
              {article.references.map((r, i) => (
                <ReferenceItem key={i} idx={i + 1} item={r} />
              ))}
            </ol>
            <p className="mt-4 text-xs text-muted-foreground">
              All references link to the corresponding PubMed record. Citations
              maintained for transparency — Viora articles are sourced from the
              published research literature.
            </p>
          </section>
        )}

        {/* Compliance */}
        <div className="mt-10 rounded-xl border border-border bg-brand-soft p-4 text-xs leading-relaxed text-foreground/85">
          <strong>For research use only.</strong> All compounds referenced in this
          article are intended strictly for laboratory research and
          experimentation. Not for human or animal consumption, diagnostic, or
          therapeutic use.
        </div>
      </article>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="text-xs font-medium uppercase tracking-wider text-brand">
              Compounds covered in this article
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Browse related products
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related articles */}
      {related.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="text-xs font-medium uppercase tracking-wider text-brand">
              More in {article.category}
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Keep reading
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/research/${a.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-semibold text-brand">
                      {a.category}
                    </span>
                    <span className="text-muted-foreground">
                      {a.readMinutes} min
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold leading-snug text-foreground group-hover:text-brand">
                    {a.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {a.excerpt}
                  </p>
                  <div className="mt-4 text-xs font-semibold text-brand">
                    Read article →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Section({ section }: { section: ArticleSection }) {
  switch (section.type) {
    case "h2":
      return (
        <h2 className="mt-10 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {section.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-8 text-xl font-semibold tracking-tight text-foreground">
          {section.text}
        </h3>
      );
    case "p":
      return (
        <p className="mt-4 text-base leading-relaxed text-foreground/85">
          {section.text}
        </p>
      );
    case "ul":
      return (
        <ul className="mt-4 space-y-2.5 text-base leading-relaxed text-foreground/85">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60">
                {section.headers.map((h, i) => (
                  <th
                    key={i}
                    className="border-b border-border px-4 py-3 text-left font-semibold text-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-border last:border-b-0">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-4 py-3 align-top text-foreground/85"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <div
          className={`mt-6 rounded-xl border p-4 text-sm leading-relaxed ${
            section.variant === "warn"
              ? "border-amber-300 bg-amber-50 text-amber-900"
              : "border-brand/30 bg-brand-soft text-foreground"
          }`}
        >
          {section.text}
        </div>
      );
  }
}

function ReferenceItem({ idx, item }: { idx: number; item: Reference }) {
  const pubmedUrl = item.pmid
    ? `https://pubmed.ncbi.nlm.nih.gov/${item.pmid}/`
    : null;
  return (
    <li className="flex gap-3">
      <span className="font-mono text-xs text-muted-foreground">[{idx}]</span>
      <span className="flex-1 text-foreground/85">
        <strong className="text-foreground">{item.authors}</strong> {item.title}{" "}
        {item.journal && <em className="not-italic">{item.journal}</em>}{" "}
        <span className="text-muted-foreground">({item.year}).</span>{" "}
        {pubmedUrl && (
          <a
            href={pubmedUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-brand hover:underline"
          >
            PMID: {item.pmid} ↗
          </a>
        )}
        {item.doi && (
          <>
            {" "}
            ·{" "}
            <a
              href={`https://doi.org/${item.doi}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand hover:underline"
            >
              DOI ↗
            </a>
          </>
        )}
      </span>
    </li>
  );
}
