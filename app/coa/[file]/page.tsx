import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs/promises";
import path from "node:path";

type Props = { params: Promise<{ file: string }> };

/**
 * Inline COA viewer — keeps the visitor on viorahealthcare.com instead of
 * yeeting them into a raw PDF browser tab.
 *
 * Per Marvin's call (2026-05-12): "Don't leave the site ever."
 *
 * Route: /coa/VHC-2649801 → embeds /coas/polaris/VHC-2649801.pdf in an
 * iframe wrapped in the Viora layout, with header/footer chrome and a
 * back-link to the product page (passed via ?from=<slug>).
 */
export async function generateMetadata({ params }: Props) {
  const { file } = await params;
  return {
    title: `Certificate of Analysis · ${file}`,
    description: `View the analytical certificate of analysis for batch ${file}.`,
  };
}

export default async function CoaViewerPage({
  params,
  searchParams,
}: {
  params: Promise<{ file: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { file } = await params;
  const { from } = await searchParams;

  // Only allow alphanumeric + dash filenames (block path traversal)
  if (!/^[A-Za-z0-9_-]+$/.test(file)) notFound();

  // Confirm the PDF exists under public/coas/polaris/
  const pdfPath = path.join(process.cwd(), "public", "coas", "polaris", `${file}.pdf`);
  try {
    await fs.access(pdfPath);
  } catch {
    notFound();
  }

  const pdfUrl = `/coas/polaris/${file}.pdf`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Breadcrumb / back */}
      <nav className="mb-4 flex items-center justify-between text-xs">
        <div className="text-muted-foreground">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-brand">Products</Link>
          {from && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/products/${from}`} className="hover:text-brand">
                ← Back to product
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-foreground">COA {file}</span>
        </div>
        <a
          href={pdfUrl}
          download
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
        >
          Download PDF ↓
        </a>
      </nav>

      <header className="border-b border-border pb-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-brand">
          Certificate of Analysis
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Batch {file}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Independent third-party analytical report from Polaris Analytical. Verifies
          purity, molecular identity, and endotoxin levels for this batch.
        </p>
      </header>

      {/* Inline PDF viewer */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <iframe
          src={`${pdfUrl}#view=FitH&toolbar=0`}
          title={`COA ${file}`}
          className="h-[80vh] w-full"
        />
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Trouble viewing? <a href={pdfUrl} download className="font-medium text-brand hover:underline">Download the PDF</a>.
      </p>
    </div>
  );
}
