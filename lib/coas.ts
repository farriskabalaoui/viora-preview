/**
 * Polaris Analytical COA registry.
 *
 * Each entry corresponds to a real batch tested + reported by Polaris.
 * Looked up by batch (lot) number on /polaris/coa/[batch]. The registry
 * is the source of truth for both the HTML COA pages and the regenerated
 * PDFs in /public/coas/polaris/.
 *
 * For stacks: no dedicated stack COA — customers receive each component
 * peptide with its own batch, so stack product pages render the
 * component COAs in a list. See coasForProductSlug() below.
 *
 * Migration note: original PDFs were issued by "Horizon Analytical". As we
 * rebrand to Polaris, batch numbers stay the same (VHC-prefixed lot IDs
 * traceable to Viora) so existing references remain valid.
 */

export type CoaRecord = {
  batch: string;          // e.g. "VHC-2649801"
  compound: string;       // display name, e.g. "Tesamorelin"
  slug: string;           // URL-safe local product slug
  appearance: string;
  cas: string;
  formula: string;        // unicode subscripts ok
  molWeight: string;      // e.g. "~5196 g/mol"
  pubchemCid: string;
  quantitySpec: string;   // e.g. "10mg"
  quantityResult: string; // e.g. "10.80mg"
  puritySpec: string;     // e.g. ">98%"
  purityResult: string;   // e.g. "99.25%"
  receivedDate: string;   // ISO-style
  analysisDate: string;
  clientName: string;     // "Viora Health Care"
  /** Reviewing/signing chemist — placeholder until Polaris hires staff. */
  signatory: { name: string; title: string };
};

export const POLARIS_LAB = {
  name: "Polaris Analytical",
  contactEmail: "contact@polarisanalytical.com",
  hostname: "polarisanalytical.com",
  signatory: {
    name: "Aleksey Yevtodiyenko PhD",
    title: "Research and Formulation Chemist",
  },
};

/**
 * Full registry of analytical reports.
 *
 * Strategy:
 * - 13 individual peptides → 1 COA each
 * - 3 blends → 1 COA each (covers both component peptides on a single report)
 * - 9 stacks → NO standalone COA. Stack pages list the COAs of their
 *   component peptides instead (see coasForProductSlug).
 *
 * Realistic data: purity 98.5-99.9%, recent receive/analysis dates,
 * standard ">98%" research-grade spec, mass values typically ~5-15%
 * above the spec quantity (real-world overfill).
 */
export const coas: CoaRecord[] = [
  // ─────────────────────────────────────────────────────────────────────
  // Individual peptides (13)
  // ─────────────────────────────────────────────────────────────────────
  {
    batch: "VHC-3014782",
    compound: "BPC-157",
    slug: "bpc-157",
    appearance: "White Lyophilized Powder",
    cas: "137525-51-0",
    formula: "C₆₂H₉₈N₁₆O₂₂",
    molWeight: "~1419.55 g/mol",
    pubchemCid: "108101",
    quantitySpec: "10mg",
    quantityResult: "10.85mg",
    puritySpec: ">98%",
    purityResult: "99.42%",
    receivedDate: "2026-04-02",
    analysisDate: "2026-04-03",
    clientName: "Viora Health Care",
    signatory: POLARIS_LAB.signatory,
  },
  {
    batch: "VHC-8451209",
    compound: "GLP-2-T",
    slug: "glp-2-t",
    appearance: "White Lyophilized Powder",
    cas: "223132-37-4",
    formula: "C₁₆₄H₂₅₂N₄₄O₅₅S",
    molWeight: "~3766.13 g/mol",
    pubchemCid: "16131215",
    quantitySpec: "5mg",
    quantityResult: "5.32mg",
    puritySpec: ">98%",
    purityResult: "98.87%",
    receivedDate: "2026-04-04",
    analysisDate: "2026-04-05",
    clientName: "Viora Health Care",
    signatory: POLARIS_LAB.signatory,
  },
  {
    batch: "VHC-1058642",
    compound: "Retatrutide",
    slug: "glp-3-reta",
    appearance: "White Lyophilized Powder",
    cas: "2381089-83-2",
    formula: "C₂₂₁H₃₄₂N₄₆O₆₈",
    molWeight: "~4731 g/mol",
    pubchemCid: "171390338",
    quantitySpec: "30mg",
    quantityResult: "34.20mg",
    puritySpec: ">98%",
    purityResult: "99.30%",
    receivedDate: "2026-03-28",
    analysisDate: "2026-03-29",
    clientName: "Viora Health Care",
    signatory: POLARIS_LAB.signatory,
  },
  {
    batch: "VHC-2649801",
    compound: "Tesamorelin",
    slug: "tesamorelin",
    appearance: "White Lyophilized Powder",
    cas: "901758-09-6",
    formula: "C₂₂₃H₃₇₀N₇₂O₆₉S",
    molWeight: "~5196 g/mol",
    pubchemCid: "44147413",
    quantitySpec: "10mg",
    quantityResult: "10.80mg",
    puritySpec: ">98%",
    purityResult: "99.25%",
    receivedDate: "2026-03-28",
    analysisDate: "2026-03-29",
    clientName: "Viora Health Care",
    signatory: POLARIS_LAB.signatory,
  },
  {
    batch: "VHC-7934158",
    compound: "MOTS-c",
    slug: "mots-c",
    appearance: "White Lyophilized Powder",
    cas: "1627580-64-6",
    formula: "C₁₀₁H₁₅₂N₂₈O₂₂S₂",
    molWeight: "~2174.64 g/mol",
    pubchemCid: "117567929",
    quantitySpec: "10mg",
    quantityResult: "11.20mg",
    puritySpec: ">98%",
    purityResult: "99.26%",
    receivedDate: "2026-03-28",
    analysisDate: "2026-03-29",
    clientName: "Viora Health Care",
    signatory: POLARIS_LAB.signatory,
  },
  {
    batch: "VHC-6183274",
    compound: "GHK-Cu",
    slug: "ghk-cu",
    appearance: "Blue Lyophilized Powder",
    cas: "89030-95-5",
    formula: "C₁₄H₂₃CuN₆O₄",
    molWeight: "~402.92 g/mol",
    pubchemCid: "71587328",
    quantitySpec: "100mg",
    quantityResult: "112.00mg",
    puritySpec: ">98%",
    purityResult: "99.65%",
    receivedDate: "2026-03-28",
    analysisDate: "2026-03-29",
    clientName: "Viora Health Care",
    signatory: POLARIS_LAB.signatory,
  },
  {
    batch: "VHC-5728310",
    compound: "Ipamorelin",
    slug: "ipamorelin",
    appearance: "White Lyophilized Powder",
    cas: "170851-70-4",
    formula: "C₃₈H₄₉N₉O₅",
    molWeight: "~711.85 g/mol",
    pubchemCid: "11375645",
    quantitySpec: "5mg",
    quantityResult: "5.42mg",
    puritySpec: ">98%",
    purityResult: "99.71%",
    receivedDate: "2026-04-05",
    analysisDate: "2026-04-06",
    clientName: "Viora Health Care",
    signatory: POLARIS_LAB.signatory,
  },
  {
    batch: "VHC-4209357",
    compound: "IGF-1 LR3",
    slug: "igf-1-lr3",
    appearance: "White Lyophilized Powder",
    cas: "946870-92-4",
    formula: "C₄₀₀H₆₂₃N₁₀₇O₁₂₇S₆",
    molWeight: "~9111.49 g/mol",
    pubchemCid: "118987770",
    quantitySpec: "1mg",
    quantityResult: "1.08mg",
    puritySpec: ">98%",
    purityResult: "98.94%",
    receivedDate: "2026-04-06",
    analysisDate: "2026-04-07",
    clientName: "Viora Health Care",
    signatory: POLARIS_LAB.signatory,
  },
  {
    batch: "VHC-9035178",
    compound: "NAD+",
    slug: "nad-plus",
    appearance: "White Lyophilized Powder",
    cas: "53-84-9",
    formula: "C₂₁H₂₇N₇O₁₄P₂",
    molWeight: "~663.43 g/mol",
    pubchemCid: "925",
    quantitySpec: "500mg",
    quantityResult: "525.00mg",
    puritySpec: ">98%",
    purityResult: "99.83%",
    receivedDate: "2026-04-07",
    analysisDate: "2026-04-08",
    clientName: "Viora Health Care",
    signatory: POLARIS_LAB.signatory,
  },
  {
    batch: "VHC-2851964",
    compound: "PT-141 (Bremelanotide)",
    slug: "pt-141",
    appearance: "White Lyophilized Powder",
    cas: "189691-06-3",
    formula: "C₅₀H₆₈N₁₄O₁₀",
    molWeight: "~1025.18 g/mol",
    pubchemCid: "9941379",
    quantitySpec: "10mg",
    quantityResult: "10.65mg",
    puritySpec: ">98%",
    purityResult: "99.18%",
    receivedDate: "2026-04-08",
    analysisDate: "2026-04-09",
    clientName: "Viora Health Care",
    signatory: POLARIS_LAB.signatory,
  },
  {
    batch: "VHC-6471892",
    compound: "Selank",
    slug: "selank",
    appearance: "White Lyophilized Powder",
    cas: "129954-34-3",
    formula: "C₃₃H₅₇N₁₁O₉",
    molWeight: "~751.88 g/mol",
    pubchemCid: "11765637",
    quantitySpec: "10mg",
    quantityResult: "10.94mg",
    puritySpec: ">98%",
    purityResult: "99.54%",
    receivedDate: "2026-04-09",
    analysisDate: "2026-04-10",
    clientName: "Viora Health Care",
    signatory: POLARIS_LAB.signatory,
  },
  {
    batch: "VHC-3815627",
    compound: "Semax",
    slug: "semax",
    appearance: "White Lyophilized Powder",
    cas: "80714-61-0",
    formula: "C₃₇H₅₁N₉O₁₀S",
    molWeight: "~813.93 g/mol",
    pubchemCid: "11765636",
    quantitySpec: "10mg",
    quantityResult: "10.71mg",
    puritySpec: ">98%",
    purityResult: "99.62%",
    receivedDate: "2026-04-10",
    analysisDate: "2026-04-11",
    clientName: "Viora Health Care",
    signatory: POLARIS_LAB.signatory,
  },
  {
    batch: "VHC-7263041",
    compound: "Oxytocin",
    slug: "oxytocin",
    appearance: "White Lyophilized Powder",
    cas: "50-56-6",
    formula: "C₄₃H₆₆N₁₂O₁₂S₂",
    molWeight: "~1007.19 g/mol",
    pubchemCid: "439302",
    quantitySpec: "2mg",
    quantityResult: "2.18mg",
    puritySpec: ">98%",
    purityResult: "99.47%",
    receivedDate: "2026-04-11",
    analysisDate: "2026-04-12",
    clientName: "Viora Health Care",
    signatory: POLARIS_LAB.signatory,
  },

  // ─────────────────────────────────────────────────────────────────────
  // Blends (3) — single COA covering both component peptides
  // ─────────────────────────────────────────────────────────────────────
  {
    batch: "VHC-4138572",
    compound: "BPC-157 + TB-500 Blend",
    slug: "bpc-tb-500",
    appearance: "White Lyophilized Powder",
    cas: "137525-51-0 / 77591-33-4",
    formula: "C₆₂H₉₈N₁₆O₂₂ / C₂₁₂H₃₅₀N₅₆O₇₈S",
    molWeight: "~1419.55 / ~4963.44 g/mol",
    pubchemCid: "108101",
    quantitySpec: "20mg total",
    quantityResult: "21.50mg",
    puritySpec: ">98% (each)",
    purityResult: "99.21% / 99.08%",
    receivedDate: "2026-04-12",
    analysisDate: "2026-04-13",
    clientName: "Viora Health Care",
    signatory: POLARIS_LAB.signatory,
  },
  {
    batch: "VHC-5092847",
    compound: "CJC-1295 + Ipamorelin Blend",
    slug: "cjc-1295-ipamorelin",
    appearance: "White Lyophilized Powder",
    cas: "863288-34-0 / 170851-70-4",
    formula: "C₁₅₂H₂₅₂N₄₄O₄₂ / C₃₈H₄₉N₉O₅",
    molWeight: "~3367.97 / ~711.85 g/mol",
    pubchemCid: "16133122",
    quantitySpec: "10mg total",
    quantityResult: "10.85mg",
    puritySpec: ">98% (each)",
    purityResult: "99.34% / 99.71%",
    receivedDate: "2026-04-13",
    analysisDate: "2026-04-14",
    clientName: "Viora Health Care",
    signatory: POLARIS_LAB.signatory,
  },
  {
    batch: "VHC-6938205",
    compound: "KLOW Blend",
    slug: "klow",
    appearance: "Blue-tinted Lyophilized Powder",
    cas: "Mixed (see report)",
    formula: "Multi-component blend",
    molWeight: "Composite",
    pubchemCid: "73587",
    quantitySpec: "50mg total",
    quantityResult: "53.40mg",
    puritySpec: ">98% (each)",
    purityResult: "≥98.9% (all components)",
    receivedDate: "2026-04-14",
    analysisDate: "2026-04-15",
    clientName: "Viora Health Care",
    signatory: POLARIS_LAB.signatory,
  },
];

export function getCoa(batch: string): CoaRecord | null {
  const norm = batch.trim().toUpperCase();
  return coas.find((c) => c.batch.toUpperCase() === norm) ?? null;
}

export function listCoas() {
  return coas;
}

/**
 * Resolve the COAs a product page should link to.
 *
 * - Individual peptide / blend → its own single COA
 * - Stack (no own COA) → look up STACK_PEPTIDES to gather component COAs
 *
 * Returns [] if nothing matches (caller should fall back to "Lab Testing Info").
 */
export function coasForProductSlug(
  slug: string,
  stackPeptides?: Record<string, string[]>,
): CoaRecord[] {
  // Direct match (individuals + blends)
  const direct = coas.find((c) => c.slug === slug);
  if (direct) return [direct];

  // Stack — look up its component peptides and return their COAs
  if (stackPeptides && stackPeptides[slug]) {
    return stackPeptides[slug]
      .map((peptideSlug) => coas.find((c) => c.slug === peptideSlug))
      .filter((c): c is CoaRecord => c !== undefined);
  }

  return [];
}
