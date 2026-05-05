export type ArticleSection =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "callout"; variant?: "info" | "warn"; text: string };

export type Reference = {
  authors: string;
  title: string;
  journal?: string;
  year: number;
  pmid?: string;
  doi?: string;
};

export type Article = {
  slug: string;
  title: string;
  category: "Compound Profile" | "Methodology" | "Quality" | "Comparison";
  excerpt: string;
  publishedAt: string;
  readMinutes: number;
  body: ArticleSection[];
  references?: Reference[];
  relatedProductSlugs?: string[];
  /** Override hero image. Defaults to first relatedProductSlug photo. */
  heroImage?: string;
  /** For multi-vial composition on hero. */
  heroPeptides?: string[];
  featured?: boolean;
};

/**
 * Get the best hero image for an article. Falls back through:
 * 1. Explicit heroImage if set
 * 2. First related product's photo
 * 3. Generic clean Viora vial
 */
export function articleHeroImage(article: Article): string {
  if (article.heroImage) return article.heroImage;
  if (article.relatedProductSlugs?.[0]) {
    return `/products/${article.relatedProductSlugs[0]}.webp`;
  }
  return "/products/bpc-157.webp";
}

/**
 * Get the multi-vial peptide list for an article hero (if it should be multi).
 * Returns null for single-vial heros.
 */
export function articleHeroPeptides(article: Article): string[] | null {
  if (article.heroPeptides) return article.heroPeptides;
  // For comparison or methodology articles, show 2-3 vials if related product list has them
  if (
    (article.category === "Comparison" || article.category === "Methodology") &&
    article.relatedProductSlugs &&
    article.relatedProductSlugs.length >= 2
  ) {
    return article.relatedProductSlugs.slice(0, 3);
  }
  return null;
}

export const categories = [
  "Compound Profile",
  "Methodology",
  "Quality",
  "Comparison",
] as const;

export const articles: Article[] = [
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "what-is-bpc-157",
    title: "What is BPC-157? A Research Overview",
    category: "Compound Profile",
    excerpt:
      "BPC-157 is a 15-amino-acid synthetic peptide derived from a protein found in human gastric juice. Here's what the research literature says — and what it doesn't.",
    publishedAt: "2026-03-11",
    readMinutes: 7,
    featured: true,
    relatedProductSlugs: ["bpc-157", "bpc-tb-500"],
    body: [
      {
        type: "p",
        text: "BPC-157 (Body Protection Compound-157) is a synthetic peptide derived from a naturally occurring protein found in human gastric juice. It is composed of 15 amino acids and has gained significant attention in the scientific community for its potential role in various areas of laboratory research.",
      },
      {
        type: "p",
        text: "Originally identified during studies related to gastrointestinal protection and tissue recovery, BPC-157 has since become a focus of interest across a wide range of experimental research fields. Scientists are exploring how this peptide interacts with cellular signaling pathways, growth factors, and tissue regeneration processes in controlled laboratory environments.",
      },
      { type: "h2", text: "Molecular Structure and Origin" },
      {
        type: "p",
        text: "BPC-157 is a stable pentadecapeptide fragment derived from the Body Protection Compound found in gastric juice. Due to its stability in biological environments and its relatively simple peptide structure, it has become a widely studied compound in experimental peptide research.",
      },
      {
        type: "p",
        text: "Researchers often examine BPC-157 for its interactions with various biological systems, including its potential influence on angiogenesis (the formation of new blood vessels), cellular repair mechanisms, and inflammatory responses in laboratory models.",
      },
      { type: "h2", text: "Areas of Active Research" },
      {
        type: "p",
        text: "In laboratory studies, BPC-157 has been investigated for its potential involvement in several research areas, including:",
      },
      {
        type: "ul",
        items: [
          "Tissue regeneration and cellular repair mechanisms",
          "Angiogenesis and vascular biology research",
          "Gastrointestinal system studies",
          "Musculoskeletal and tendon research models",
          "Neurological and neuroprotective signaling",
        ],
      },
      {
        type: "p",
        text: "These studies are conducted under controlled research conditions to better understand how peptides may influence biological signaling pathways and cellular processes.",
      },
      { type: "h2", text: "Quality and Laboratory Testing" },
      {
        type: "p",
        text: "High-purity BPC-157 peptides used in research are typically synthesized in controlled laboratory environments and undergo rigorous analytical testing. Common testing methods include High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry to verify purity (typically ≥99%) and molecular composition. Reputable suppliers publish third-party Certificates of Analysis (COAs) per batch.",
      },
      {
        type: "callout",
        variant: "warn",
        text: "BPC-157 is intended strictly for in-vitro research and laboratory purposes only. It is not approved for human consumption, diagnostic, or therapeutic use. All experiments should be conducted by qualified professionals in appropriate research settings.",
      },
      { type: "h2", text: "Conclusion" },
      {
        type: "p",
        text: "As peptide science continues to evolve, BPC-157 remains an important compound of interest in experimental research. Its unique structure and stability have made it a valuable subject in studies exploring tissue biology, cellular repair pathways, and peptide-based research models.",
      },
    ],
    references: [
      {
        authors: "Sikiric P, et al.",
        title:
          "Stable gastric pentadecapeptide BPC 157: novel therapy in gastrointestinal tract.",
        journal: "Current Pharmaceutical Design",
        year: 2018,
        pmid: "29215318",
      },
      {
        authors: "Chang CH, et al.",
        title:
          "The promoting effect of pentadecapeptide BPC 157 on tendon healing involves tendon outgrowth, cell survival, and cell migration.",
        journal: "Journal of Applied Physiology",
        year: 2011,
        pmid: "21879054",
      },
      {
        authors: "Chang CH, et al.",
        title:
          "Pentadecapeptide BPC 157 enhances the growth hormone receptor expression in tendon fibroblasts.",
        journal: "Molecules",
        year: 2014,
        pmid: "24388801",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "retatrutide-research-guide",
    title: "Retatrutide (GLP-3) Research Guide",
    category: "Compound Profile",
    excerpt:
      "Retatrutide is a novel investigational triple-receptor agonist (GLP-1, GIP, glucagon). A look at its mechanism and the research behind it.",
    publishedAt: "2026-03-11",
    readMinutes: 8,
    featured: true,
    relatedProductSlugs: ["glp-3-reta", "viora-metabolic-stack"],
    body: [
      {
        type: "p",
        text: "Retatrutide is a novel investigational peptide that has gained significant attention within the scientific research community due to its unique multi-receptor activity. It functions as a triple agonist, with interactions across three metabolic receptors: GLP-1, GIP, and glucagon receptors.",
      },
      {
        type: "p",
        text: "Scientists examine this compound in controlled laboratory settings to investigate metabolic signaling pathways, energy regulation, and peptide-based biological processes.",
      },
      { type: "h2", text: "Molecular Characteristics" },
      {
        type: "p",
        text: "The synthetic peptide simultaneously targets multiple receptor pathways, allowing researchers to explore how coordinated receptor activation influences metabolic and energy balance systems. Its design has established it as an important compound in modern peptide research, especially regarding metabolic regulation and peptide signaling interactions.",
      },
      { type: "h2", text: "Areas of Scientific Investigation" },
      {
        type: "ul",
        items: [
          "Metabolic pathway research and energy homeostasis",
          "Endocrine and hormonal signaling studies",
          "Body-composition and adiposity models",
          "Peptide-receptor interaction characterization",
          "Cellular signaling analysis across GLP-1/GIP/glucagon axes",
        ],
      },
      { type: "h2", text: "Why Triple-Agonism Matters in Research" },
      {
        type: "p",
        text: "Single-receptor agonists like semaglutide (GLP-1 only) have driven much of the recent metabolic-research literature. Triple agonists allow researchers to investigate how simultaneous receptor activation produces effects that single-target compounds cannot replicate, particularly in models of energy expenditure and lipolysis.",
      },
      { type: "h2", text: "Laboratory Synthesis and Purity" },
      {
        type: "p",
        text: "High-quality research-grade Retatrutide undergoes advanced solid-phase synthesis followed by strict QC. HPLC verifies purity (typically ≥99%) and Mass Spectrometry confirms molecular composition. Reputable suppliers provide a Certificate of Analysis with each batch.",
      },
      {
        type: "callout",
        variant: "warn",
        text: "Retatrutide is intended strictly for scientific and laboratory research purposes only. It is not approved for human consumption or clinical use.",
      },
    ],
    references: [
      {
        authors: "Jastreboff AM, et al.",
        title: "Triple-Hormone-Receptor Agonist Retatrutide for Obesity — A Phase 2 Trial.",
        journal: "New England Journal of Medicine",
        year: 2023,
        pmid: "37356067",
        doi: "10.1056/NEJMoa2301972",
      },
      {
        authors: "Coskun T, et al.",
        title:
          "LY3437943, a novel triple glucagon-like peptide-1, glucose-dependent insulinotropic polypeptide, and glucagon receptor agonist for the treatment of type 2 diabetes and obesity: A preclinical evaluation.",
        journal: "Cell Metabolism",
        year: 2022,
        pmid: "35926484",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "semax-vs-selank",
    title: "Semax vs Selank: A Comparative Research Guide",
    category: "Comparison",
    excerpt:
      "Both are synthetic peptides studied for cognitive and neurobehavioral research — but they differ in origin, mechanism, and primary research focus.",
    publishedAt: "2026-03-11",
    readMinutes: 9,
    relatedProductSlugs: ["semax", "selank", "viora-mood-balance-stack"],
    body: [
      {
        type: "p",
        text: "Semax and Selank are two synthetic peptides that have gained attention in the scientific research community due to their potential influence on neurological and cognitive processes. Both peptides were originally developed through Russian peptide research programs and are commonly studied in laboratory settings focused on neurobiology, cognitive function, and neurotransmitter regulation.",
      },
      {
        type: "p",
        text: "Although Semax and Selank share similarities as research peptides used in neurological studies, they differ in their molecular structure, mechanisms of action, and areas of scientific investigation.",
      },
      { type: "h2", text: "What is Semax?" },
      {
        type: "p",
        text: "Semax is a synthetic peptide derived from a fragment of the adrenocorticotropic hormone (ACTH 4-10). It has been widely studied in laboratory environments for its potential influence on cognitive processes and neurochemical signaling pathways.",
      },
      {
        type: "p",
        text: "Researchers often examine Semax in experimental models related to:",
      },
      {
        type: "ul",
        items: [
          "Cognitive function and memory research",
          "Neurotransmitter regulation studies",
          "Neuroprotective signaling pathways",
          "Brain-derived neurotrophic factor (BDNF) expression research",
          "Central nervous system peptide interactions",
        ],
      },
      { type: "h2", text: "What is Selank?" },
      {
        type: "p",
        text: "Selank is another synthetic peptide developed through peptide research focused on neurobiology and immune system signaling. Structurally related to the naturally occurring peptide tuftsin, Selank has been studied for its interactions with neurotransmitter systems and potential influence on stress-response pathways in laboratory models.",
      },
      {
        type: "p",
        text: "Areas of research involving Selank include:",
      },
      {
        type: "ul",
        items: [
          "Neurotransmitter modulation studies",
          "Stress-response pathway research",
          "Immune system signaling investigations",
          "GABAergic neurotransmission models",
          "Neurobiological research models",
        ],
      },
      { type: "h2", text: "Key Differences" },
      {
        type: "table",
        headers: ["Feature", "Semax", "Selank"],
        rows: [
          ["Peptide Origin", "ACTH 4-10 fragment", "Tuftsin-derived heptapeptide"],
          [
            "Primary Research Focus",
            "Cognitive function & neuroprotection",
            "Neurotransmitter modulation & stress response",
          ],
          [
            "Key Research Areas",
            "Memory, BDNF signaling",
            "GABAergic regulation, immune signaling",
          ],
          [
            "Common Research Models",
            "Cognitive performance, neuroprotection",
            "Anxiolytic, stress-resilience studies",
          ],
        ],
      },
      {
        type: "callout",
        variant: "warn",
        text: "Both peptides are intended strictly for scientific and laboratory research purposes only. Not approved for human consumption or clinical use.",
      },
    ],
    references: [
      {
        authors: "Eremin KO, et al.",
        title:
          "Semax, an ACTH(4-10) analogue with nootropic properties, activates dopaminergic and serotoninergic brain systems in rodents.",
        journal: "Neurochemical Research",
        year: 2005,
        pmid: "16289608",
      },
      {
        authors: "Inozemtseva LS, et al.",
        title:
          "Intranasal administration of the peptide Semax affects c-fos gene expression in some structures of rat brain.",
        journal: "Bulletin of Experimental Biology and Medicine",
        year: 2008,
        pmid: "18496958",
      },
      {
        authors: "Volkova A, et al.",
        title:
          "Selank Administration Affects the Expression of Some Genes Involved in GABAergic Neurotransmission.",
        journal: "Frontiers in Pharmacology",
        year: 2018,
        pmid: "30158826",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "peptide-reconstitution-guide",
    title: "Peptide Reconstitution: A Practical Lab Guide",
    category: "Methodology",
    excerpt:
      "How to safely reconstitute lyophilized research peptides — solvents, ratios, sterile technique, and post-reconstitution storage.",
    publishedAt: "2026-03-11",
    readMinutes: 6,
    featured: true,
    heroImage: "/products/tesamorelin.webp",
    body: [
      {
        type: "p",
        text: "Peptide reconstitution is the process of preparing a lyophilized (freeze-dried) peptide by dissolving it in an appropriate sterile solvent for laboratory research use. Researchers reconstitute peptides before experiments to ensure accurate dosing and consistency across runs.",
      },
      { type: "h2", text: "Why Lyophilization Matters" },
      {
        type: "p",
        text: "Lyophilization removes water under controlled vacuum conditions, leaving a stable cake that can be stored for long periods at refrigerator or freezer temperatures. Benefits:",
      },
      {
        type: "ul",
        items: [
          "Improved chemical stability over months/years",
          "Reduced risk of hydrolytic degradation",
          "Easier transport at ambient temperatures",
          "Predictable rehydration behavior",
        ],
      },
      { type: "h2", text: "Common Research Solvents" },
      {
        type: "ul",
        items: [
          "Bacteriostatic water (BAC) — 0.9% benzyl alcohol; standard for most research peptides",
          "Sterile water for injection — when preservative-free is required",
          "Acetic acid solutions (0.1–1%) — for hydrophobic peptides with poor water solubility",
          "Sodium acetate buffer — for pH-sensitive peptides",
        ],
      },
      { type: "h2", text: "Step-by-Step Procedure" },
      {
        type: "ul",
        items: [
          "Prepare a sterile workspace and PPE; wipe surfaces with isopropyl alcohol",
          "Allow the lyophilized vial and solvent to reach room temperature (20–25 °C)",
          "Calculate target concentration: e.g., 5 mg peptide + 2 mL BAC = 2.5 mg/mL",
          "Aspirate solvent into a sterile syringe; inject slowly down the inside wall of the vial",
          "Do not shake — gently swirl until the cake fully dissolves (1–3 min)",
          "Inspect for clarity; cloudy or particulate solutions indicate a problem",
          "Label the reconstituted vial with date, concentration, and solvent",
        ],
      },
      { type: "h2", text: "Post-Reconstitution Storage" },
      {
        type: "ul",
        items: [
          "Refrigerate (2–8 °C) for short-term use, typically within 2–4 weeks",
          "For longer storage, freeze single-use aliquots at –20 °C or –80 °C",
          "Avoid repeated freeze-thaw cycles — each cycle accelerates degradation",
          "Protect from light; many peptides are photosensitive",
        ],
      },
      { type: "h2", text: "Reconstitution Math (Quick Reference)" },
      {
        type: "table",
        headers: ["Peptide Mass", "Solvent Volume", "Final Concentration"],
        rows: [
          ["5 mg", "2 mL", "2.5 mg/mL (2,500 µg/mL)"],
          ["5 mg", "5 mL", "1 mg/mL (1,000 µg/mL)"],
          ["10 mg", "2 mL", "5 mg/mL (5,000 µg/mL)"],
          ["10 mg", "5 mL", "2 mg/mL (2,000 µg/mL)"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "All reconstitution practices in this guide are for in-vitro research preparation only. They do not constitute medical or clinical instructions.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "hplc-vs-mass-spec",
    title: "HPLC vs Mass Spec: How Peptides Get Tested",
    category: "Quality",
    excerpt:
      "Two analytical methods every research-grade peptide should pass. Here's what each measures, why both matter, and what to look for in a COA.",
    publishedAt: "2026-03-11",
    readMinutes: 6,
    relatedProductSlugs: ["bpc-157", "tesamorelin", "ghk-cu", "glp-3-reta"],
    heroPeptides: ["bpc-157", "tesamorelin", "ghk-cu"],
    body: [
      {
        type: "p",
        text: "Quality verification is a critical part of peptide research and manufacturing. Before research peptides are distributed for laboratory use, they undergo analytical testing to confirm their identity, purity, and molecular composition. Two of the most widely used testing methods are High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS).",
      },
      { type: "h2", text: "Why Peptide Testing Is Important" },
      {
        type: "p",
        text: "Research peptides must meet precise purity and composition requirements to ensure reliable experimental results. Without proper analytical testing, impurities or incorrect molecular structures could compromise outcomes.",
      },
      {
        type: "p",
        text: "Reputable research peptide suppliers provide third-party testing and verified Certificates of Analysis (COAs) documenting:",
      },
      {
        type: "ul",
        items: [
          "Peptide purity percentage (HPLC)",
          "Molecular identity and composition (Mass Spec)",
          "Presence of impurities or contaminants",
          "Consistency between production batches",
        ],
      },
      { type: "h2", text: "High-Performance Liquid Chromatography (HPLC)" },
      {
        type: "p",
        text: "HPLC separates the components of a sample as they pass through a specialized column under high pressure. The detector records each component, producing a chromatogram that displays the purity profile of the peptide. For research-grade peptides, purity levels often exceed 99%.",
      },
      { type: "h2", text: "Mass Spectrometry (MS)" },
      {
        type: "p",
        text: "Mass Spectrometry confirms molecular identity and structure. The peptide is ionized and broken into charged particles, which are measured by their mass-to-charge ratio. The output (a mass spectrum) confirms the precise molecular weight and verifies that the peptide matches its expected sequence.",
      },
      { type: "h2", text: "HPLC vs MS at a Glance" },
      {
        type: "table",
        headers: ["Feature", "HPLC", "Mass Spectrometry"],
        rows: [
          ["Primary Function", "Measures peptide purity", "Confirms molecular identity"],
          ["Output", "Chromatogram (purity %)", "Mass spectrum (molecular weight)"],
          ["What it catches", "Impurities, byproducts", "Wrong sequence, fragments"],
          ["When to use both", "Always — they're complementary", "Always — they're complementary"],
        ],
      },
      { type: "h2", text: "How to Read a COA" },
      {
        type: "p",
        text: "A proper COA should include the batch/lot number, peptide sequence, purity (HPLC), molecular weight (MS), date of analysis, and the name of the third-party lab. View Viora's published COAs for Tesamorelin, MOTS-c, GHK-Cu, and Retatrutide on the Lab Testing page.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "ghk-cu-skin-research",
    title: "GHK-Cu in Skin & Tissue Research",
    category: "Compound Profile",
    excerpt:
      "GHK-Cu is a copper-binding tripeptide first isolated from human plasma. Decades of research literature show why it's a foundational skin and tissue-repair compound.",
    publishedAt: "2026-04-02",
    readMinutes: 7,
    relatedProductSlugs: ["ghk-cu", "viora-longevity-stack"],
    body: [
      {
        type: "p",
        text: "GHK-Cu (glycyl-L-histidyl-L-lysine copper) is a naturally occurring tripeptide first isolated from human plasma in the 1970s. The compound chelates a copper(II) ion, forming the GHK-Cu complex that has been studied extensively in skin biology, wound healing, and extracellular-matrix research.",
      },
      { type: "h2", text: "Mechanism Overview" },
      {
        type: "p",
        text: "GHK-Cu's biological activity is closely tied to its ability to bind and transport copper, a cofactor for many extracellular-matrix enzymes. Research has documented its influence on collagen and glycosaminoglycan synthesis, on the activity of metalloproteinases, and on the modulation of inflammatory and antioxidant gene expression.",
      },
      { type: "h2", text: "Active Areas of Research" },
      {
        type: "ul",
        items: [
          "Wound healing and tissue-repair models",
          "Skin-aging and photodamage research",
          "Hair-follicle biology and stem-cell signaling",
          "Anti-inflammatory pathway studies",
          "Antioxidant and free-radical-scavenging activity",
        ],
      },
      { type: "h2", text: "Quality Considerations" },
      {
        type: "p",
        text: "Because GHK-Cu's activity depends on the proper 1:1 GHK-to-copper ratio, batch consistency is critical. Reputable suppliers verify the copper-bound complex via UV-Vis absorbance at ~525 nm in addition to standard HPLC and mass-spec analysis.",
      },
      {
        type: "callout",
        variant: "warn",
        text: "GHK-Cu is intended strictly for in-vitro research and laboratory purposes only. Not approved for human consumption, diagnostic, or therapeutic use.",
      },
    ],
    references: [
      {
        authors: "Pickart L, Margolina A.",
        title: "Regenerative and Protective Actions of the GHK-Cu Peptide in the Light of the New Gene Data.",
        journal: "International Journal of Molecular Sciences",
        year: 2018,
        pmid: "30042334",
      },
      {
        authors: "Pickart L, et al.",
        title: "GHK Peptide as a Natural Modulator of Multiple Cellular Pathways in Skin Regeneration.",
        journal: "BioMed Research International",
        year: 2015,
        pmid: "26236500",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "designing-stack-protocols",
    title: "Designing Reproducible Peptide Stack Protocols",
    category: "Methodology",
    excerpt:
      "Why pre-blended stacks matter for research reproducibility — and how to evaluate a stack's design before incorporating it into your protocol.",
    publishedAt: "2026-04-08",
    readMinutes: 8,
    relatedProductSlugs: [
      "viora-premium-weight-loss-stack",
      "bpc-tb-500",
      "cjc-1295-ipamorelin",
    ],
    body: [
      {
        type: "p",
        text: "Reproducibility is the single biggest concern in modern peptide research. Stack-level variability — different ratios, different reconstitution conditions, inconsistent sourcing — accounts for an enormous fraction of failed replications across labs.",
      },
      { type: "h2", text: "Why Pre-Blended Stacks Matter" },
      {
        type: "p",
        text: "Manually combining individual peptides at the bench introduces compounding sources of error: pipetting variability, reconstitution timing differences, and ratio drift across batches. Pre-blended stacks lock the ratio at manufacture, with both peptides verified together via HPLC.",
      },
      { type: "h2", text: "What to Look for in a Stack" },
      {
        type: "ul",
        items: [
          "Stated ratio of each component (e.g., 2:1 CJC-1295 to Ipamorelin)",
          "Combined HPLC trace showing both peaks and their relative areas",
          "Mass-spec confirmation for each component",
          "Batch-level COA covering both peptides",
          "Documented reconstitution recommendation",
        ],
      },
      { type: "h2", text: "Common Research Stacks" },
      {
        type: "table",
        headers: ["Stack", "Components", "Typical Research Focus"],
        rows: [
          ["BPC-157 + TB-500", "Tissue-repair peptides", "Recovery, vascular biology"],
          [
            "CJC-1295 + Ipamorelin",
            "GHRH analog + ghrelin agonist",
            "Somatotropic axis research",
          ],
          [
            "GHK-Cu + BPC-157 (KLOW-style)",
            "Copper peptide + tissue-repair",
            "Skin and tissue research",
          ],
        ],
      },
      { type: "h2", text: "Documentation Checklist" },
      {
        type: "p",
        text: "Before any stack enters a research protocol, document: source, batch number, COA URL, reconstitution date, solvent, final concentration, and storage conditions. Share this with your protocol — future-you and any replicator will thank you.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "reading-a-coa",
    title: "How to Read a Certificate of Analysis (COA)",
    category: "Quality",
    excerpt:
      "Every batch of research peptide should ship with a COA. Here's how to read one — and the red flags that should make you walk away from a supplier.",
    publishedAt: "2026-04-15",
    readMinutes: 5,
    body: [
      {
        type: "p",
        text: "A Certificate of Analysis (COA) is a one-page document that summarizes a batch's identity and purity. It is the single most important piece of paper attached to any research-grade peptide. Knowing how to read one is the difference between confident research and unreliable data.",
      },
      { type: "h2", text: "What a Good COA Contains" },
      {
        type: "ul",
        items: [
          "Peptide name and full amino-acid sequence",
          "Molecular formula and theoretical molecular weight",
          "Batch / lot number and date of synthesis",
          "HPLC purity percentage (with chromatogram, ideally)",
          "Mass-spectrometry result confirming molecular weight",
          "Name of the third-party laboratory and signature",
          "Storage and handling recommendations",
        ],
      },
      { type: "h2", text: "Red Flags" },
      {
        type: "ul",
        items: [
          "No batch number or lot identifier",
          "Generic 'pass / fail' instead of an actual purity %",
          "No third-party lab name (in-house only)",
          "No chromatogram or mass spectrum images attached",
          "Date of analysis missing or far older than expected",
          "Identical-looking COA reused across multiple batches (a giveaway)",
        ],
      },
      { type: "h2", text: "Sample Viora COAs" },
      {
        type: "p",
        text: "Every Viora batch is independently tested by accredited third-party laboratories. Recently published COAs include Tesamorelin (lot VHC-2649801), MOTS-c (lot VHC-7934158), GHK-Cu (lot VHC-6183274), and Retatrutide (lot VHC-1058642) — all available as PDFs on the Lab Testing page.",
      },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
