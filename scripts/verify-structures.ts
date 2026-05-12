/**
 * Verifies that every product SKU's structure diagrams will actually
 * render. Walks PRODUCT_RESEARCH[slug].structures[] for every product
 * and confirms each PeptideStructure has a pubchemId that resolves to
 * a PNG file on disk.
 *
 * Run with: npx tsx scripts/verify-structures.ts
 */
import fs from "node:fs";
import path from "node:path";
import { products } from "../lib/products";
import { PRODUCT_RESEARCH } from "../lib/product-research";

const PUBLIC_STRUCTURES = path.join(process.cwd(), "public", "structures");

// MUST match components/structure-diagram.tsx CID_TO_SLUG
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
  "16129610": "tb-500",
  "16133122": "cjc-1295",
};

const issues: string[] = [];
let okCount = 0;

for (const product of products) {
  const research = PRODUCT_RESEARCH[product.slug];
  if (!research) {
    issues.push(`${product.slug}: NO research entry`);
    continue;
  }
  if (!research.structures || research.structures.length === 0) {
    issues.push(`${product.slug}: NO structures defined`);
    continue;
  }
  for (const s of research.structures) {
    if (!s.pubchemId) {
      issues.push(`${product.slug} → ${s.name}: missing pubchemId`);
      continue;
    }
    const slug = CID_TO_SLUG[s.pubchemId];
    if (!slug) {
      issues.push(
        `${product.slug} → ${s.name} (CID ${s.pubchemId}): not in CID_TO_SLUG`,
      );
      continue;
    }
    const pngPath = path.join(PUBLIC_STRUCTURES, `${slug}.png`);
    if (!fs.existsSync(pngPath)) {
      issues.push(`${product.slug} → ${s.name}: PNG missing at ${pngPath}`);
      continue;
    }
    const size = fs.statSync(pngPath).size;
    if (size < 500) {
      issues.push(
        `${product.slug} → ${s.name}: PNG too small (${size} bytes — error response?)`,
      );
      continue;
    }
    okCount++;
  }
}

console.log(`Verified ${okCount} structure renderings across ${products.length} products\n`);
if (issues.length === 0) {
  console.log("✅ ALL structures render correctly on ALL products");
  process.exit(0);
} else {
  console.log(`❌ ${issues.length} issue(s):\n`);
  for (const i of issues) console.log("  - " + i);
  process.exit(1);
}
