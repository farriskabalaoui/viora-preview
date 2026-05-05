export type ProductSize = { mg: number; price: number };

export type Product = {
  slug: string;
  name: string;
  priceFrom: number;
  priceMax?: number;
  category: "Stack" | "Blend" | "Peptide";
  tags: string[];
  short: string;
  long: string;
  purity: string;
  sizes?: ProductSize[];
  image: string;
  /** For stacks/blends: ordered slugs of the individual peptides included.
   *  Used to render a clean multi-vial composition in cards. */
  peptides?: string[];
  featured?: boolean;
};

/**
 * Stack → peptide mapping (sourced from viorahealthcare.com/store).
 * Used by ProductCard to render multi-vial composite imagery.
 */
export const STACK_PEPTIDES: Record<string, string[]> = {
  "viora-premium-weight-loss-stack": ["glp-3-reta", "tesamorelin", "mots-c"],
  "viora-weight-loss-stack": ["tesamorelin", "glp-3-reta"],
  "viora-metabolic-stack": ["glp-3-reta", "mots-c", "nad-plus"],
  "viora-gut-health-stack": ["bpc-157", "glp-2-t"],
  "viora-longevity-stack": ["nad-plus", "mots-c", "ghk-cu"],
  "viora-hormone-signaling-stack": ["tesamorelin", "ipamorelin", "igf-1-lr3"],
  "viora-mood-balance-stack": ["selank", "semax", "oxytocin"],
  "viora-intimacy-research-stack": ["pt-141", "oxytocin"],
  "viora-ceo-stack": ["nad-plus", "semax", "selank"],
};

/**
 * Blend → peptide mapping (sourced from viorahealthcare.com/store).
 */
export const BLEND_PEPTIDES: Record<string, string[]> = {
  "bpc-tb-500": ["bpc-157", "tb-500"],
  "cjc-1295-ipamorelin": ["cjc-1295-no-dac", "ipamorelin"],
  "klow": ["bpc-157", "ghk-cu"],
};

export const products: Product[] = [
  // ── PEPTIDE STACKS ───────────────────────────────────────────
  {
    slug: "viora-premium-weight-loss-stack",
    name: "Viora Premium Weight Loss Stack",
    priceFrom: 388,
    category: "Stack",
    tags: ["Best Seller", "Weight Loss"],
    short:
      "Expanded metabolic research stack — adds MOTS-C, a mitochondrial peptide, to the standard weight-loss protocol.",
    long:
      "The Viora Premium Weight Loss Stack expands on metabolic research by adding MOTS-C, a mitochondrial peptide studied for cellular energy regulation, on top of the core weight-loss compounds. Designed for advanced research protocols studying compound metabolic and mitochondrial pathways together.",
    purity: "≥99% (HPLC verified, all components)",
    image: "/products/tesamorelin.webp",
    featured: true,
  },
  {
    slug: "viora-weight-loss-stack",
    name: "Viora Weight Loss Stack",
    priceFrom: 303,
    category: "Stack",
    tags: ["Weight Loss"],
    short:
      "Combines peptides studied for their role in metabolic signaling and fat metabolism.",
    long:
      "The Viora Weight Loss Stack combines peptides studied for their role in metabolic signaling and fat metabolism research. Each component is independently lab-verified and pre-portioned for reproducible study protocols.",
    purity: "≥99% (HPLC verified, all components)",
    image: "/products/glp-3-reta.webp",
    featured: true,
  },
  {
    slug: "viora-metabolic-stack",
    name: "Viora Metabolic Stack",
    priceFrom: 430,
    category: "Stack",
    tags: ["Metabolic"],
    short:
      "Combines peptides studied for their potential role in metabolic signaling.",
    long:
      "The Viora Metabolic Stack combines peptides studied for their potential role in metabolic signaling, glucose regulation, and energy homeostasis. Designed for comprehensive metabolic research protocols.",
    purity: "≥99% (HPLC verified, all components)",
    image: "/products/mots-c.webp",
  },
  {
    slug: "viora-gut-health-stack",
    name: "Viora Gut Health Stack",
    priceFrom: 265,
    category: "Stack",
    tags: ["Gut Health"],
    short:
      "Combines peptides commonly researched for their influence on gastrointestinal pathways.",
    long:
      "The Viora Gut Health Stack combines peptides commonly researched for their influence on gastrointestinal repair, mucosal integrity, and gut-brain axis signaling. Pre-portioned for reproducible GI research.",
    purity: "≥99% (HPLC verified, all components)",
    image: "/products/glp-2-t.webp",
  },
  {
    slug: "viora-longevity-stack",
    name: "Viora Longevity Stack",
    priceFrom: 189,
    category: "Stack",
    tags: ["Longevity", "Anti-Aging"],
    short:
      "Compounds studied for cellular health, mitochondrial function, and longevity research.",
    long:
      "The Viora Longevity Stack focuses on compounds studied for their role in cellular health, mitochondrial function, and longevity-related signaling pathways. Includes peptides frequently cited in aging-research literature.",
    purity: "≥99% (HPLC verified, all components)",
    image: "/products/nad-plus.webp",
    featured: true,
  },
  {
    slug: "viora-hormone-signaling-stack",
    name: "Viora Hormone Signaling Stack",
    priceFrom: 102,
    category: "Stack",
    tags: ["Hormone"],
    short:
      "Peptides researched for their interaction with growth hormone signaling pathways.",
    long:
      "The Viora Hormone Signaling Stack combines peptides researched for their interaction with growth hormone-releasing hormone, somatotropic axis, and broader endocrine signaling.",
    purity: "≥99% (HPLC verified, all components)",
    image: "/products/ipamorelin.webp",
  },
  {
    slug: "viora-mood-balance-stack",
    name: "Viora Mood & Balance Stack",
    priceFrom: 70,
    category: "Stack",
    tags: ["Cognitive"],
    short:
      "Peptides researched for their influence on neurological signaling and mood pathways.",
    long:
      "The Viora Mood & Balance Stack focuses on peptides researched for their influence on neurological signaling, neurotransmitter modulation, and stress-response pathways.",
    purity: "≥99% (HPLC verified, all components)",
    image: "/products/selank.webp",
  },
  {
    slug: "viora-intimacy-research-stack",
    name: "Viora Intimacy Research Stack",
    priceFrom: 50,
    category: "Stack",
    tags: ["Hormone"],
    short:
      "Peptides studied for their interaction with melanocortin receptors.",
    long:
      "The Viora Intimacy Research Stack includes peptides studied for their interaction with melanocortin receptors and related neuroendocrine pathways. Designed for behavioral and receptor-level research.",
    purity: "≥99% (HPLC verified, all components)",
    image: "/products/pt-141.webp",
  },
  {
    slug: "viora-ceo-stack",
    name: "Viora CEO Stack",
    priceFrom: 100,
    category: "Stack",
    tags: ["Cognitive", "Performance"],
    short:
      "Compounds commonly researched for their influence on cognitive performance.",
    long:
      "The Viora CEO Stack is designed around compounds commonly researched for their influence on cognitive performance, focus, and neurological resilience under stress.",
    purity: "≥99% (HPLC verified, all components)",
    image: "/stacks/Viora-CEO-Stack.webp",
    featured: true,
  },

  // ── BLENDS ───────────────────────────────────────────────────
  {
    slug: "bpc-tb-500",
    name: "BPC-157 / TB-500",
    priceFrom: 75,
    category: "Blend",
    tags: ["Best Seller", "Recovery"],
    short:
      "Two peptides commonly researched for their role in tissue regeneration and recovery biology.",
    long:
      "The BPC-157 and TB-500 blend combines two peptides commonly researched for their role in tissue regeneration, vascular formation, and recovery biology. Pre-blended in standardized ratios for reproducible study protocols.",
    purity: "≥99% (HPLC verified, both peptides)",
    image: "/products/bpc-tb-500.webp",
    featured: true,
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 / Ipamorelin",
    priceFrom: 75,
    category: "Blend",
    tags: ["Hormone"],
    short:
      "Growth hormone signaling pathways and synergistic hormonal effects.",
    long:
      "The CJC-1295 and Ipamorelin blend combines two peptides researched for their potential influence on growth hormone signaling pathways, often paired in research literature for their synergistic effects on the somatotropic axis.",
    purity: "≥99% (HPLC verified, both peptides)",
    image: "/products/cjc-ipamorelin.webp",
  },
  {
    slug: "klow",
    name: "KLOW",
    priceFrom: 85,
    category: "Blend",
    tags: ["Recovery", "Anti-Aging"],
    short:
      "Peptide blend researched for its interaction with metabolic and energy regulation pathways.",
    long:
      "KLOW is a peptide blend researched for its interaction with metabolic, recovery, and energy regulation pathways. Pre-portioned for reproducible study protocols.",
    purity: "≥99% (HPLC verified, all components)",
    image: "/products/klow.webp",
  },

  // ── INDIVIDUAL PEPTIDES ──────────────────────────────────────
  {
    slug: "bpc-157",
    name: "BPC-157",
    priceFrom: 25,
    category: "Peptide",
    tags: ["Popular", "Recovery"],
    short:
      "Synthetic peptide derived from a protective protein found in gastric juices.",
    long:
      "BPC-157 is a synthetic peptide derived from a protective protein found in gastric juices. Widely cited in preclinical research on tissue repair, angiogenesis, and gut-brain signaling. Each batch is HPLC and mass-spec verified.",
    purity: "≥99% (HPLC verified)",
    sizes: [
      { mg: 5, price: 25 },
      { mg: 10, price: 45 },
    ],
    image: "/products/bpc-157.webp",
    featured: true,
  },
  {
    slug: "glp-2-t",
    name: "GLP-2 (T)",
    priceFrom: 45,
    priceMax: 310,
    category: "Peptide",
    tags: ["Special Offer", "Gut Health"],
    short:
      "Synthetic peptide widely researched for its role in gut health and intestinal growth.",
    long:
      "GLP-2 is a synthetic peptide widely researched for its role in gut health, intestinal growth, and nutrient absorption. Manufactured to research-grade specifications with full third-party verification.",
    purity: "≥99% (HPLC verified)",
    sizes: [
      { mg: 5, price: 45 },
      { mg: 10, price: 85 },
      { mg: 50, price: 310 },
    ],
    image: "/products/glp-2-t.webp",
    featured: true,
  },
  {
    slug: "glp-3-reta",
    name: "GLP-3 (Reta)",
    priceFrom: 75,
    priceMax: 270,
    category: "Peptide",
    tags: ["Special Offer", "Metabolic"],
    short:
      "Advanced multi-receptor peptide commonly referenced as Retatrutide in research.",
    long:
      "GLP-3, commonly referred to in research as Retatrutide, is an advanced multi-receptor peptide studied in metabolic and appetite-pathway research. Includes published purity COA per batch.",
    purity: "≥99% (HPLC verified)",
    sizes: [
      { mg: 5, price: 75 },
      { mg: 10, price: 145 },
      { mg: 30, price: 270 },
    ],
    image: "/products/glp-3-reta.webp",
    featured: true,
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    priceFrom: 43,
    category: "Peptide",
    tags: ["Hormone"],
    short:
      "Synthetic analogue of growth hormone-releasing hormone (GHRH).",
    long:
      "Tesamorelin is a synthetic analogue of growth hormone-releasing hormone (GHRH) commonly studied in research on the somatotropic axis, body composition, and metabolic pathways.",
    purity: "≥99% (HPLC verified)",
    sizes: [
      { mg: 2, price: 43 },
      { mg: 5, price: 99 },
    ],
    image: "/products/tesamorelin.webp",
  },
  {
    slug: "mots-c",
    name: "MOTS-C",
    priceFrom: 25,
    priceMax: 90,
    category: "Peptide",
    tags: ["Anti-Aging"],
    short:
      "Mitochondrial-derived peptide studied in metabolism and mitochondrial-function research.",
    long:
      "MOTS-C is a mitochondrial-derived peptide that has gained attention in research related to metabolism, mitochondrial function, and cellular energy regulation.",
    purity: "≥99% (HPLC verified)",
    sizes: [
      { mg: 5, price: 25 },
      { mg: 10, price: 49 },
      { mg: 30, price: 90 },
    ],
    image: "/products/mots-c.webp",
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu (Copper Peptide)",
    priceFrom: 22,
    priceMax: 29,
    category: "Peptide",
    tags: ["Best Seller", "Anti-Aging"],
    short:
      "Naturally occurring copper-binding peptide studied for tissue repair and collagen production.",
    long:
      "GHK-Cu is a naturally occurring copper-binding peptide studied extensively for its involvement in tissue repair, collagen synthesis, and skin biology research.",
    purity: "≥99% (HPLC verified)",
    sizes: [
      { mg: 50, price: 22 },
      { mg: 100, price: 29 },
    ],
    image: "/products/ghk-cu.webp",
    featured: true,
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    priceFrom: 19,
    priceMax: 25,
    category: "Peptide",
    tags: ["Popular", "Hormone"],
    short:
      "Selective growth hormone secretagogue studied for its interaction with ghrelin receptors.",
    long:
      "Ipamorelin is a selective growth hormone secretagogue studied for its interaction with ghrelin receptors and the broader somatotropic axis.",
    purity: "≥99% (HPLC verified)",
    sizes: [
      { mg: 2, price: 19 },
      { mg: 5, price: 25 },
    ],
    image: "/products/ipamorelin.webp",
  },
  {
    slug: "igf-1-lr3",
    name: "IGF-1 LR3",
    priceFrom: 49,
    category: "Peptide",
    tags: ["Hormone"],
    short:
      "Modified analogue of Insulin-Like Growth Factor-1 with extended half-life.",
    long:
      "IGF-1 LR3 is a modified analogue of Insulin-Like Growth Factor-1 designed with an extended half-life for research applications studying cell growth, tissue development, and anabolic signaling pathways.",
    purity: "≥99% (HPLC verified)",
    sizes: [{ mg: 1, price: 49 }],
    image: "/products/igf-1-lr3.webp",
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    priceFrom: 43,
    priceMax: 85,
    category: "Peptide",
    tags: ["Anti-Aging"],
    short:
      "Critical coenzyme present in all living cells — central to metabolism research.",
    long:
      "NAD+ (Nicotinamide Adenine Dinucleotide) is a critical coenzyme present in all living cells. Central to research on cellular energy production, redox biology, and metabolic regulation.",
    purity: "≥99% (HPLC verified)",
    sizes: [
      { mg: 100, price: 43 },
      { mg: 500, price: 85 },
    ],
    image: "/products/nad-plus.webp",
  },
  {
    slug: "pt-141",
    name: "PT-141",
    priceFrom: 25,
    category: "Peptide",
    tags: ["Best Seller", "Popular"],
    short:
      "Peptide also known as Bremelanotide — studied for melanocortin-receptor interaction.",
    long:
      "PT-141, also known as Bremelanotide in research settings, is a peptide studied for its interaction with melanocortin receptors and broader hormonal signaling pathways.",
    purity: "≥99% (HPLC verified)",
    sizes: [{ mg: 10, price: 25 }],
    image: "/products/pt-141.webp",
  },
  {
    slug: "selank",
    name: "Selank",
    priceFrom: 25,
    category: "Peptide",
    tags: ["Special Offer", "Cognitive"],
    short:
      "Synthetic peptide derived from the tuftsin family — stress and neurological research.",
    long:
      "Selank is a synthetic peptide derived from the tuftsin peptide family and is commonly researched for its role in stress response and neurological signaling.",
    purity: "≥99% (HPLC verified)",
    sizes: [{ mg: 5, price: 25 }],
    image: "/products/selank.webp",
  },
  {
    slug: "semax",
    name: "Semax",
    priceFrom: 25,
    category: "Peptide",
    tags: ["Special Offer", "Cognitive"],
    short:
      "Synthetic neuropeptide studied for brain function, memory, and cognitive performance.",
    long:
      "Semax is a synthetic neuropeptide widely studied for its role in brain function, memory, and cognitive performance research.",
    purity: "≥99% (HPLC verified)",
    sizes: [{ mg: 5, price: 25 }],
    image: "/products/semax.webp",
  },
  {
    slug: "oxytocin",
    name: "Oxytocin",
    priceFrom: 35,
    category: "Peptide",
    tags: ["Popular"],
    short:
      "Naturally occurring peptide hormone — social bonding and neurological signaling research.",
    long:
      "Oxytocin is a naturally occurring peptide hormone widely researched for its involvement in social bonding, reproductive endocrinology, and neurological signaling.",
    purity: "≥99% (HPLC verified)",
    sizes: [{ mg: 2, price: 35 }],
    image: "/products/oxytocin.webp",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const categories = ["Stack", "Blend", "Peptide"] as const;

export const tagFilters = [
  "Best Seller",
  "Popular",
  "Special Offer",
  "Recovery",
  "Anti-Aging",
  "Weight Loss",
  "Cognitive",
  "Hormone",
  "Gut Health",
  "Metabolic",
  "Longevity",
];
