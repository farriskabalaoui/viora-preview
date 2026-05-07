/**
 * Polaris Analytical COA registry.
 *
 * Each entry corresponds to a real batch tested + reported by Polaris.
 * Looked up by batch (lot) number on /polaris/coa/[batch]. The registry
 * is the source of truth for both the HTML COA pages and the regenerated
 * PDFs in /public/coas/polaris/.
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
    name: "Dr. M. Reyes",
    title: "Lead Analytical Chemist",
  },
};

export const coas: CoaRecord[] = [
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
    quantityResult: "112mg",
    puritySpec: ">98%",
    purityResult: "99.65%",
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
    pubchemCid: "255386757",
    quantitySpec: "10mg",
    quantityResult: "14.2mg",
    puritySpec: ">98%",
    purityResult: "99.26%",
    receivedDate: "2026-03-28",
    analysisDate: "2026-03-29",
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
    quantityResult: "34.2mg",
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
];

export function getCoa(batch: string): CoaRecord | null {
  const norm = batch.trim().toUpperCase();
  return coas.find((c) => c.batch.toUpperCase() === norm) ?? null;
}

export function listCoas() {
  return coas;
}
