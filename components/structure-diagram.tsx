import Image from "next/image";
import fs from "node:fs";
import path from "node:path";

/**
 * PubChem CID → local slug for the structure PNG.
 *
 * Populated by scripts/regen-pubchem-structures (the curl that downloaded
 * /public/structures/<slug>.png). Update this map whenever you add a new
 * peptide + fetch its structure.
 */
const CID_TO_SLUG: Record<string, string> = {
  "108101": "bpc-157",
  "16131215": "glp-2-t",
  "171390338": "glp-3-reta",
  "44147413": "tesamorelin",
  "117567929": "mots-c",
  "71587328": "ghk-cu",
  "11375645": "ipamorelin",
  "118987770": "igf-1-lr3",
  "925": "nad-plus",
  "9941379": "pt-141",
  "11765637": "selank",
  "11765636": "semax",
  "439302": "oxytocin",
};

/**
 * 2D molecular structure card. Renders the PNG fetched from PubChem.
 *
 * Accepts either an explicit slug (for individual peptide pages) or a
 * pubchemCid (for stack/blend pages that aggregate multiple peptides —
 * each component's structure renders separately).
 *
 * Returns null if no matching PNG is on disk so the parent doesn't have
 * to guard. Server component for build-time fs check.
 */
export function StructureDiagram({
  slug,
  pubchemCid,
  name,
}: {
  slug?: string;
  pubchemCid?: string;
  name: string;
}) {
  const resolvedSlug =
    slug ?? (pubchemCid ? CID_TO_SLUG[pubchemCid] : undefined);
  if (!resolvedSlug) return null;

  // Defensive: only render when the file exists at build time
  const onDisk = path.join(
    process.cwd(),
    "public",
    "structures",
    `${resolvedSlug}.png`,
  );
  try {
    if (!fs.statSync(onDisk).isFile()) return null;
  } catch {
    return null;
  }

  return (
    <div className="mt-5 rounded-2xl border border-border bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
        <div className="relative aspect-square w-full max-w-[200px] flex-none self-center overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.04]">
          <Image
            src={`/structures/${resolvedSlug}.png`}
            alt={`${name} 2D molecular structure`}
            fill
            sizes="200px"
            className="object-contain p-3"
          />
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand">
            2D Structure
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Canonical 2D structure of {name} rendered from the PubChem record
            maintained by the U.S. National Library of Medicine.
          </p>
          {pubchemCid && (
            <a
              href={`https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
            >
              View full record on PubChem
              <span aria-hidden>↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
