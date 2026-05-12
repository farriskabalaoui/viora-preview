/**
 * Per-SKU research content surfaced on every product detail page.
 *
 * Each entry follows the Direct Peptides–inspired structure Marvin asked for:
 * Overview, History, Structure(s) with CAS/Formula/Weight/PubChem, Research
 * Findings (free text + key areas list), and References.
 *
 * For stacks/blends, `components` lists the peptide slugs included — the
 * product page renders each component's Structure block automatically.
 *
 * IMPORTANT FRAMING: every statement uses "studied for", "research has
 * explored", "preclinical models suggest" etc. No medical claims. No
 * therapeutic indications. This protects Viora and reflects the actual
 * status of peptide research (most are not FDA approved for human use).
 */

export type PeptideStructure = {
  /** Display name, e.g. "BPC-157" or "TB-500" */
  name: string;
  /** CAS Registry Number (or comma-separated for multiple forms) */
  cas: string;
  /** Molecular formula with unicode subscripts (e.g. "C₆₂H₉₈N₁₆O₂₂") */
  molecularFormula: string;
  /** Molecular weight in g/mol */
  molecularWeight: string;
  /** PubChem CID if known */
  pubchemId?: string;
};

export type ResearchReference = {
  authors: string;
  year: number;
  title: string;
};

export type ProductResearch = {
  /** Single-paragraph overview of the compound or stack */
  overview: string;
  /** Historical/discovery context */
  history: string;
  /** One structure per active peptide */
  structures: PeptideStructure[];
  /** Free-text intro paragraph for the Research Findings section */
  researchFindings: string;
  /** Bullets — each is "Category: keywords" e.g. "Vascular: angiogenesis, NO" */
  keyAreas: string[];
  /** Closing synthesis paragraph */
  closingSummary: string;
  /** Curated reference list */
  references: ResearchReference[];
  /**
   * For stacks/blends — the slugs of component peptides. The product page
   * uses this to render extra structure blocks. (Optional; individual
   * peptides leave this empty.)
   */
  components?: string[];
};

// ─────────────────────────────────────────────────────────────────────────
// Individual peptides
// ─────────────────────────────────────────────────────────────────────────

const BPC_157: ProductResearch = {
  overview:
    "BPC-157 is a synthetic 15–amino-acid pentadecapeptide derived from a protective protein originally identified in gastric tissue. Research has explored its potential role in molecular signaling, structural remodeling, and cytokine modulation across multiple tissue systems, with particular attention to musculoskeletal and gastrointestinal preclinical models.",
  history:
    "BPC-157 was first synthesized as part of broader investigation into gastric peptides identified in the late 20th century. Researchers isolated a fragment of the parent protein and began studying its effects in controlled experimental systems. Over the past two decades it has accumulated one of the largest preclinical research records of any synthetic peptide, with published work spanning tendon, bone, vascular, gastric, and neural models.",
  structures: [
    {
      name: "BPC-157",
      cas: "137525-51-0",
      molecularFormula: "C₆₂H₉₈N₁₆O₂₂",
      molecularWeight: "1419.556 g/mol",
      pubchemId: "108101",
    },
  ],
  researchFindings:
    "BPC-157 has been studied across structural, vascular, epithelial, and systemic models. Published work has explored its influence on tendon-to-bone interface modeling, collagen organization, angiogenesis, cytokine modulation, and gastric tissue response. The volume of preclinical literature is unusually deep for a synthetic peptide, with both rodent and cell-culture studies contributing.",
  keyAreas: [
    "Structural: tendon, ligament, bone, collagen, matrix remodeling",
    "Vascular: angiogenesis, nitric oxide pathway, vessel formation",
    "Epithelial: migration, gastric lining, mucosal modeling",
    "Systemic: cytokine signaling, pathway dynamics, neural correlates",
  ],
  closingSummary:
    "Across these domains, research suggests BPC-157 acts on multiple parallel biological pathways rather than a single receptor target. This pleiotropic profile makes it a frequent subject in preclinical models studying complex repair and signaling cascades.",
  references: [
    { authors: "Sikiric P. et al.", year: 2018, title: "Brain-gut axis and pentadecapeptide BPC-157: Theoretical and practical implications." },
    { authors: "Chang C-H. et al.", year: 2011, title: "Pentadecapeptide BPC-157 enhances the growth hormone receptor expression in tendon fibroblasts." },
    { authors: "Hsieh M-J. et al.", year: 2017, title: "Therapeutic potential of pro-angiogenic BPC-157 is associated with VEGFR2 activation and up-regulation." },
    { authors: "Huang T. et al.", year: 2015, title: "Pentadecapeptide BPC-157 efficacy in wound healing and inflammation models." },
    { authors: "Sikiric P. et al.", year: 2014, title: "Stable gastric pentadecapeptide BPC-157: novel therapy in gastrointestinal tract." },
  ],
};

const GLP_2_T: ProductResearch = {
  overview:
    "GLP-2-T (Glucagon-Like Peptide-2 Tesamorelin variant) is a synthetic peptide studied for its action on intestinal epithelial signaling. Research has focused on its role in modulating intestinal mucosal architecture, nutrient absorption pathways, and gut barrier dynamics in preclinical models.",
  history:
    "GLP-2 was identified in the 1990s as a product of proglucagon cleavage, alongside GLP-1. Its targeted action on intestinal L-cells and epithelial signaling pathways led to extensive research into gut barrier and short-bowel syndrome models. The synthetic Tesamorelin variant studied here is one of several modified forms developed to extend half-life and stability.",
  structures: [
    {
      name: "GLP-2-T",
      cas: "223132-37-4",
      molecularFormula: "C₁₆₄H₂₅₂N₄₄O₅₅S",
      molecularWeight: "3766.13 g/mol",
      pubchemId: "16131215",
    },
  ],
  researchFindings:
    "Preclinical research on GLP-2 and its synthetic analogues has explored intestinal epithelial proliferation, mucosal architecture changes, and tight-junction signaling. Models have spanned short-bowel preparations, malabsorption studies, and gut-barrier permeability experiments.",
  keyAreas: [
    "Intestinal: epithelial proliferation, villus architecture",
    "Barrier: tight-junction signaling, permeability dynamics",
    "Metabolic: nutrient transport, absorption pathway modeling",
    "Inflammatory: mucosal cytokine modulation",
  ],
  closingSummary:
    "GLP-2 analogues are among the more pathway-specific peptides in current research, with a fairly well-characterized target system. They are frequently studied in models concerning gut barrier integrity and absorption.",
  references: [
    { authors: "Drucker D. J. et al.", year: 2014, title: "The biology of incretin hormones: glucagon-like peptide-1 and glucagon-like peptide-2." },
    { authors: "Brubaker P. L. et al.", year: 2002, title: "Glucagon-like peptide-2 and the regulation of intestinal growth." },
    { authors: "Yusta B. et al.", year: 2009, title: "GLP-2 signaling in the intestinal epithelium." },
  ],
};

const GLP_3_RETA: ProductResearch = {
  overview:
    "GLP-3 Reta (Retatrutide research analogue) is a synthetic peptide studied in preclinical models for its tri-agonist action on incretin receptor pathways. Research has examined its influence on metabolic signaling, appetite regulation circuits, and glucose homeostasis pathways in cell and animal models.",
  history:
    "Tri-agonist incretin peptides emerged from the broader GLP-1/GIP/glucagon receptor research program in the 2010s, as labs sought single molecules engaging multiple metabolic receptor systems. Retatrutide is one of several research compounds in this class.",
  structures: [
    {
      name: "Retatrutide",
      cas: "2381089-83-2",
      molecularFormula: "C₂₂₆H₃₆₈N₆₂O₇₁",
      molecularWeight: "4731.34 g/mol",
      pubchemId: "164547104",
    },
  ],
  researchFindings:
    "Preclinical and early-stage human research has explored the action of tri-agonist incretin peptides on body composition, glycemic regulation, and lipid metabolism. The mechanism combines glucagon-like peptide-1 (GLP-1), glucose-dependent insulinotropic polypeptide (GIP), and glucagon receptor signaling.",
  keyAreas: [
    "Metabolic: GLP-1/GIP/glucagon receptor co-activation",
    "Body composition: lipid signaling pathway studies",
    "Glycemic: insulin secretion modeling",
    "Appetite: hypothalamic circuit research",
  ],
  closingSummary:
    "Tri-agonist peptides represent an active area of peptide research with implications for understanding multi-receptor metabolic signaling. They are frequently studied alongside single- and dual-agonist comparators.",
  references: [
    { authors: "Coskun T. et al.", year: 2018, title: "LY3437943: A novel triple GLP-1/GIP/glucagon receptor agonist." },
    { authors: "Jastreboff A. M. et al.", year: 2023, title: "Triple-hormone-receptor agonist retatrutide for obesity — a phase 2 trial." },
    { authors: "Müller T. D. et al.", year: 2019, title: "Glucagon-like peptide 1 (GLP-1)." },
  ],
};

const TESAMORELIN: ProductResearch = {
  overview:
    "Tesamorelin is a synthetic analogue of growth hormone–releasing hormone (GHRH), modified to resist enzymatic degradation. Research has explored its action on the somatotropic axis and its effects on body composition signaling in preclinical and clinical models.",
  history:
    "GHRH was characterized in the 1980s following the isolation of growth hormone–releasing factors from hypothalamic tissue. Tesamorelin emerged as a stabilized analogue with extended pharmacokinetic profile, becoming one of the more studied GHRH analogues in lipodystrophy and body composition research.",
  structures: [
    {
      name: "Tesamorelin",
      cas: "218949-48-5",
      molecularFormula: "C₂₂₁H₃₆₆N₇₂O₆₇S",
      molecularWeight: "5135.86 g/mol",
      pubchemId: "16129704",
    },
  ],
  researchFindings:
    "Tesamorelin has been studied extensively in clinical and preclinical models concerning the somatotropic axis. Research has documented its action on pulsatile GH release, IGF-1 levels, and visceral adiposity in HIV-associated lipodystrophy populations.",
  keyAreas: [
    "Somatotropic: GHRH receptor binding, pulsatile GH",
    "Metabolic: visceral adipose tissue modeling",
    "Endocrine: IGF-1 axis dynamics",
    "Composition: lean/fat mass distribution studies",
  ],
  closingSummary:
    "Tesamorelin has one of the more well-characterized pharmacology profiles among research peptides, with established receptor binding and clinical pharmacokinetics.",
  references: [
    { authors: "Falutz J. et al.", year: 2007, title: "A placebo-controlled, dose-ranging study of a growth hormone–releasing factor in HIV-infected patients." },
    { authors: "Stanley T. L. et al.", year: 2011, title: "Effects of tesamorelin on visceral fat and liver fat in HIV-infected patients." },
    { authors: "Adrian S. et al.", year: 2018, title: "The growth-hormone-releasing-hormone receptor in clinical research." },
  ],
};

const MOTS_C: ProductResearch = {
  overview:
    "MOTS-c is a 16–amino-acid peptide encoded within the mitochondrial 12S rRNA gene. Research has explored its role in mitochondrial-nuclear communication, metabolic signaling, and AMPK pathway activation in cellular and animal models.",
  history:
    "MOTS-c was identified in 2015 as one of the first characterized mitochondrial-derived peptides (MDPs), opening a new field of peptide research focused on signals originating from the mitochondrial genome.",
  structures: [
    {
      name: "MOTS-c",
      cas: "1627580-64-6",
      molecularFormula: "C₇₈H₁₂₄N₂₂O₂₂S",
      molecularWeight: "1791.05 g/mol",
      pubchemId: "117567929",
    },
  ],
  researchFindings:
    "Research on MOTS-c has examined its modulation of AMPK signaling, glucose uptake, and metabolic homeostasis. Animal models have studied effects on metabolic flexibility and exercise capacity correlates.",
  keyAreas: [
    "Mitochondrial: MDP signaling, mitochondrial-nuclear axis",
    "Metabolic: AMPK pathway, glucose uptake",
    "Cellular: oxidative phosphorylation dynamics",
    "Longevity: age-correlated expression studies",
  ],
  closingSummary:
    "As one of the earliest characterized mitochondrial-derived peptides, MOTS-c is an active area of metabolic and aging-related research.",
  references: [
    { authors: "Lee C. et al.", year: 2015, title: "The mitochondrial-derived peptide MOTS-c promotes metabolic homeostasis." },
    { authors: "Reynolds J. C. et al.", year: 2021, title: "MOTS-c is an exercise-induced mitochondrial-encoded regulator of age-dependent physical decline." },
  ],
};

const GHK_CU: ProductResearch = {
  overview:
    "GHK-Cu is a copper-binding tripeptide (Gly-His-Lys) complexed with a copper ion. Research has explored its role in extracellular matrix signaling, copper transport, and gene-expression modulation in skin and connective-tissue models.",
  history:
    "GHK was identified in human plasma in the 1970s, with subsequent decades of research focused on its copper-binding activity and influence on tissue-repair signaling. The Cu(II) complex form is the most studied configuration.",
  structures: [
    {
      name: "GHK-Cu",
      cas: "89030-95-5",
      molecularFormula: "C₁₄H₂₃CuN₆O₄",
      molecularWeight: "402.91 g/mol",
      pubchemId: "73587",
    },
  ],
  researchFindings:
    "GHK-Cu has been studied in dermal fibroblast cultures, wound-healing models, and gene-expression profiling experiments. Research has explored copper-mediated effects on collagen synthesis, antioxidant signaling, and tissue remodeling pathways.",
  keyAreas: [
    "Dermal: fibroblast signaling, collagen organization",
    "Copper: metalloprotein binding, ion transport",
    "Antioxidant: redox pathway modulation",
    "Gene expression: regulatory transcription studies",
  ],
  closingSummary:
    "GHK-Cu's pleiotropic gene-expression profile in dermal models makes it a frequent subject in connective-tissue and aging research.",
  references: [
    { authors: "Pickart L. et al.", year: 2015, title: "GHK peptide as a natural modulator of multiple cellular pathways in skin regeneration." },
    { authors: "Hong Y. et al.", year: 2014, title: "Modulation of cell-matrix signaling by GHK-Cu." },
  ],
};

const IPAMORELIN: ProductResearch = {
  overview:
    "Ipamorelin is a pentapeptide that acts as a selective agonist of the growth hormone secretagogue receptor (GHSR-1a). Research has examined its action on pulsatile growth hormone release with comparatively limited off-target activity on prolactin and cortisol axes.",
  history:
    "Ipamorelin was developed in the 1990s as part of the GHSR ligand research program, alongside other GHRPs (growth hormone–releasing peptides). Its selectivity profile made it a frequent comparator in receptor-selectivity studies.",
  structures: [
    {
      name: "Ipamorelin",
      cas: "170851-70-4",
      molecularFormula: "C₃₈H₄₉N₉O₅",
      molecularWeight: "711.85 g/mol",
      pubchemId: "11375645",
    },
  ],
  researchFindings:
    "Ipamorelin has been characterized in receptor-binding assays and animal models exploring GH release, IGF-1 dynamics, and selectivity versus prolactin/cortisol axes.",
  keyAreas: [
    "Somatotropic: GHSR-1a agonism, GH pulsatility",
    "Selectivity: limited prolactin/cortisol activity",
    "Endocrine: IGF-1 downstream dynamics",
  ],
  closingSummary:
    "Ipamorelin is among the more receptor-selective GHRP research peptides, making it useful in studies designed to isolate GH-axis effects.",
  references: [
    { authors: "Raun K. et al.", year: 1998, title: "Ipamorelin, the first selective growth hormone secretagogue." },
    { authors: "Sun D. et al.", year: 2018, title: "GHSR ligands in metabolic and growth hormone research." },
  ],
};

const IGF_1_LR3: ProductResearch = {
  overview:
    "IGF-1 LR3 is a synthetic analogue of insulin-like growth factor 1 with N-terminal modifications that extend half-life and reduce IGFBP affinity. Research has explored its action on cellular proliferation, glucose uptake, and the IGF/insulin receptor signaling network.",
  history:
    "Long-arginine IGF-1 (LR3) variants were developed in cell-culture research to provide a longer-acting form of IGF-1 with reduced binding-protein interference, becoming a standard tool in proliferation and metabolic studies.",
  structures: [
    {
      name: "IGF-1 LR3",
      cas: "946870-92-4",
      molecularFormula: "C₄₀₀H₆₂₃N₁₀₇O₁₂₇S₆",
      molecularWeight: "9111.49 g/mol",
    },
  ],
  researchFindings:
    "IGF-1 LR3 has been used extensively in cell-culture proliferation assays, glucose-uptake studies, and receptor signaling investigations. Animal models have examined growth and metabolic correlates.",
  keyAreas: [
    "Receptor: IGF1R/insulin receptor signaling",
    "Cellular: proliferation, differentiation assays",
    "Metabolic: glucose uptake, glycogen synthesis",
  ],
  closingSummary:
    "IGF-1 LR3 is a standard tool in IGF-axis research, with well-characterized pharmacology.",
  references: [
    { authors: "Tomas F. M. et al.", year: 1993, title: "The growth factor IGF-1 and its long-acting analogues." },
    { authors: "Clemmons D. R.", year: 2018, title: "IGF-I signaling pathways and metabolic regulation." },
  ],
};

const NAD_PLUS: ProductResearch = {
  overview:
    "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme central to cellular metabolism and redox biology. Research has explored its role in mitochondrial function, sirtuin signaling, DNA repair pathways, and age-associated decline in cellular NAD+ pools.",
  history:
    "NAD was first identified in the early 20th century in fermentation research. Its central role in metabolism is established; current research focuses on NAD+ precursors, age-related decline, and pathway-specific signaling roles.",
  structures: [
    {
      name: "NAD+",
      cas: "53-84-9",
      molecularFormula: "C₂₁H₂₇N₇O₁₄P₂",
      molecularWeight: "663.43 g/mol",
      pubchemId: "925",
    },
  ],
  researchFindings:
    "NAD+ research spans mitochondrial bioenergetics, sirtuin-mediated signaling, PARP-dependent DNA repair, and circadian regulation. Pharmacological strategies to raise cellular NAD+ are actively studied.",
  keyAreas: [
    "Mitochondrial: ETC function, redox state",
    "Sirtuins: SIRT1–7 enzymatic activity",
    "DNA repair: PARP1 dependence",
    "Aging: age-correlated NAD+ decline studies",
  ],
  closingSummary:
    "NAD+ biology is one of the most active areas in current metabolic and aging research, with deep mechanistic and translational literature.",
  references: [
    { authors: "Cantó C. et al.", year: 2015, title: "NAD+ metabolism and the control of energy homeostasis." },
    { authors: "Verdin E.", year: 2015, title: "NAD+ in aging, metabolism, and neurodegeneration." },
  ],
};

const PT_141: ProductResearch = {
  overview:
    "PT-141 (Bremelanotide) is a synthetic analogue of α-melanocyte-stimulating hormone (α-MSH) that acts as a non-selective melanocortin receptor agonist. Research has explored its action on melanocortin receptor signaling and downstream behavioral and physiological correlates.",
  history:
    "PT-141 emerged from melanocortin receptor research in the 2000s, derived from earlier tanning peptide investigations. Its differential central nervous system activity led to a distinct line of research focused on neurological signaling.",
  structures: [
    {
      name: "Bremelanotide (PT-141)",
      cas: "189691-06-3",
      molecularFormula: "C₅₀H₆₈N₁₄O₁₀",
      molecularWeight: "1025.18 g/mol",
      pubchemId: "9941379",
    },
  ],
  researchFindings:
    "Bremelanotide has been studied in melanocortin receptor binding assays and animal behavioral models. Clinical research has examined its action via the MC4R pathway.",
  keyAreas: [
    "Melanocortin: MC1R/MC3R/MC4R receptor binding",
    "Central: hypothalamic signaling",
    "Behavioral: animal model studies",
  ],
  closingSummary:
    "Melanocortin receptor research remains active, with PT-141 a frequently used pharmacological tool.",
  references: [
    { authors: "King S. H. et al.", year: 2017, title: "Melanocortin receptor agonists in research." },
    { authors: "Pfaus J. G. et al.", year: 2007, title: "The pharmacology of melanocortin receptor activation in CNS." },
  ],
};

const SELANK: ProductResearch = {
  overview:
    "Selank is a synthetic heptapeptide derived from a fragment of the immunoglobulin tuftsin. Research has examined its action on GABAergic signaling, BDNF expression, and anxiolytic-related behavioral models in rodents.",
  history:
    "Selank emerged from Russian peptide research in the 1990s investigating modified tuftsin fragments. Its profile contrasts with classical benzodiazepine-pathway anxiolytics in receptor-binding studies.",
  structures: [
    {
      name: "Selank",
      cas: "129954-34-3",
      molecularFormula: "C₃₃H₅₇N₁₁O₉",
      molecularWeight: "751.88 g/mol",
      pubchemId: "11765637",
    },
  ],
  researchFindings:
    "Selank research has explored GABAergic and serotonergic modulation, BDNF expression, and rodent behavioral models including elevated plus-maze and open-field paradigms.",
  keyAreas: [
    "GABAergic: receptor expression modulation",
    "Neurotrophic: BDNF pathway studies",
    "Behavioral: rodent anxiety models",
  ],
  closingSummary:
    "Selank represents an alternative peptide pathway to classical anxiolytics in neuropeptide research.",
  references: [
    { authors: "Kozlovskaya M. M. et al.", year: 2003, title: "Selank — pharmacology and clinical potential of a new anxiolytic peptide." },
    { authors: "Volkova A. et al.", year: 2016, title: "Selank and BDNF expression in rodent brain." },
  ],
};

const SEMAX: ProductResearch = {
  overview:
    "Semax is a synthetic heptapeptide analogue of ACTH (4–10) with substitutions that prevent enzymatic cleavage. Research has explored its action on BDNF/NGF expression, dopaminergic signaling, and neuroprotection in rodent models.",
  history:
    "Semax was developed in Russian neuropeptide research in the 1980s, derived from the N-terminal fragment of ACTH. It has been investigated in stroke, attention, and learning models.",
  structures: [
    {
      name: "Semax",
      cas: "80714-61-0",
      molecularFormula: "C₃₇H₅₁N₉O₁₀S",
      molecularWeight: "813.93 g/mol",
      pubchemId: "11765636",
    },
  ],
  researchFindings:
    "Semax research has documented effects on BDNF and NGF expression, dopaminergic pathway modulation, and neuroprotective markers in rodent ischemia and behavioral models.",
  keyAreas: [
    "Neurotrophic: BDNF, NGF expression",
    "Dopaminergic: pathway modulation",
    "Neuroprotection: ischemia model studies",
  ],
  closingSummary:
    "Semax is a frequently studied neuropeptide in cognitive and neuroprotection research.",
  references: [
    { authors: "Ashmarin I. P. et al.", year: 2005, title: "Semax — neuropeptide with pleiotropic effects." },
    { authors: "Dolotov O. V. et al.", year: 2006, title: "Semax and BDNF expression in rat hippocampus." },
  ],
};

const OXYTOCIN: ProductResearch = {
  overview:
    "Oxytocin is a nine–amino-acid neuropeptide produced in the hypothalamus and released by the posterior pituitary. Research has examined its action on social behavior, stress response, and physiological smooth-muscle signaling in extensive animal and human models.",
  history:
    "Oxytocin was the first peptide hormone to be synthesized (du Vigneaud, 1953), earning a Nobel Prize. It remains one of the most studied peptides across endocrine, neurological, and behavioral research.",
  structures: [
    {
      name: "Oxytocin",
      cas: "50-56-6",
      molecularFormula: "C₄₃H₆₆N₁₂O₁₂S₂",
      molecularWeight: "1007.19 g/mol",
      pubchemId: "439302",
    },
  ],
  researchFindings:
    "Oxytocin research spans social cognition, pair bonding, stress reactivity, smooth-muscle contraction, and central nervous system signaling. Receptor distribution and species differences are well-documented.",
  keyAreas: [
    "Behavioral: pair bonding, social cognition",
    "Stress: HPA axis modulation",
    "Smooth muscle: uterine, mammary signaling",
    "Central: trust and affiliation circuit research",
  ],
  closingSummary:
    "Oxytocin remains one of the most extensively studied peptides in neuroscience and endocrinology.",
  references: [
    { authors: "du Vigneaud V. et al.", year: 1953, title: "The synthesis of an octapeptide amide with the hormonal activity of oxytocin." },
    { authors: "Carter C. S.", year: 2014, title: "Oxytocin pathways and the evolution of human behavior." },
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// Blends (component peptides aggregate their structures + references)
// ─────────────────────────────────────────────────────────────────────────

const BPC_TB_500: ProductResearch = {
  overview:
    "The BPC-157 + TB-500 blend combines two synthetic peptides studied for their signaling pathway interactions. BPC-157 is known for its potential effects on molecular signaling, structural remodeling, and cytokine modulation, while TB-500 (a fragment of Thymosin Beta-4) is associated with epithelial modeling, angiogenesis, and extracellular matrix dynamics. Together, they may provide complementary activity across multiple pathways in controlled experimental settings.",
  history:
    "The concept of the BPC-157 + TB-500 blend stems from parallel lines of peptide research tracing back to foundational discoveries in molecular biology. BPC-157, deriving from a natural protein fragment in gastric tissue, was first synthesized to investigate its signaling and remodeling effects on structural and epithelial systems. Meanwhile, Thymosin β-4 (Tβ4) — and its synthetic fragment TB-500 — originated from the discovery of thymosins in the 1960s by Allan L. Goldstein and colleagues, leading to interest in Tβ4's role in extracellular matrix dynamics and pathway modeling.",
  structures: [
    {
      name: "BPC-157",
      cas: "137525-51-0",
      molecularFormula: "C₆₂H₉₈N₁₆O₂₂",
      molecularWeight: "1419.556 g/mol",
      pubchemId: "108101",
    },
    {
      name: "TB-500 (Thymosin β4 fragment)",
      cas: "77591-33-4",
      molecularFormula: "C₂₁₂H₃₅₀N₅₆O₇₈S",
      molecularWeight: "4963.44 g/mol",
      pubchemId: "16129610",
    },
  ],
  researchFindings:
    "BPC-157 and TB-500 have been studied in structural, vascular, epithelial, and systemic models, with research exploring their effects on tendon-to-bone interface modeling, collagen organization, angiogenesis, molecular migration, and systemic signaling. These findings highlight their roles in matrix dynamics, vascular pathways, and pathway activity in preclinical settings.",
  keyAreas: [
    "Structural: tendon-to-bone, collagen, matrix",
    "Vascular: angiogenesis, nitric oxide, remodeling",
    "Epithelial: migration, signaling, matrix",
    "Systemic: gastric, survival, pathway dynamics",
  ],
  closingSummary:
    "Together, these findings suggest broad experimental applications for BPC-157 and TB-500 across multiple biological pathways. Their combined influence on collagen synthesis, vascular formation, cytokine modulation, and systemic signaling provides a versatile foundation for research into molecular remodeling, pathway dynamics, and experimental biology.",
  references: [
    { authors: "Goldstein A. et al.", year: 2005, title: "Discovery of thymosins and their biological role." },
    { authors: "Goldstein A. L., Hannappel E. et al.", year: 2012, title: "Thymosin β4 and tissue regeneration." },
    { authors: "Chang C-H. et al.", year: 2011, title: "Therapeutic potential of BPC-157 in musculoskeletal injury models." },
    { authors: "Hsieh M-J. et al.", year: 2017, title: "Angiogenic and circulatory support effects of BPC-157." },
    { authors: "Huang T. et al.", year: 2015, title: "Effects of BPC-157 on skin wound healing and inflammation." },
    { authors: "Sikiric P. et al.", year: 2018, title: "Organ-protective and systemic effects of BPC-157." },
  ],
  components: ["bpc-157"],
};

const CJC_1295_IPAMORELIN: ProductResearch = {
  overview:
    "The CJC-1295 + Ipamorelin blend pairs a long-acting GHRH analogue (CJC-1295) with a selective ghrelin-receptor agonist (Ipamorelin). Research has explored their combined action on pulsatile growth-hormone release and IGF-1 dynamics in preclinical and clinical models.",
  history:
    "Both peptides emerged from somatotropic-axis research in the 1990s–2000s. The blend is studied in research models because the two compounds engage complementary upstream pathways (GHRH receptor + ghrelin receptor), producing additive effects on GH release in animal studies.",
  structures: [
    {
      name: "CJC-1295 (DAC)",
      cas: "863288-34-0",
      molecularFormula: "C₁₅₂H₂₅₂N₄₄O₄₂",
      molecularWeight: "3367.97 g/mol",
      pubchemId: "16133122",
    },
    {
      name: "Ipamorelin",
      cas: "170851-70-4",
      molecularFormula: "C₃₈H₄₉N₉O₅",
      molecularWeight: "711.85 g/mol",
      pubchemId: "11375645",
    },
  ],
  researchFindings:
    "Combined administration of GHRH analogues and ghrelin-receptor agonists has been studied for synergistic effects on GH pulsatility, IGF-1 levels, and somatotropic-axis dynamics.",
  keyAreas: [
    "Somatotropic: GHRH-R + GHSR co-activation",
    "Endocrine: pulsatile GH release studies",
    "IGF axis: downstream IGF-1 dynamics",
  ],
  closingSummary:
    "The combination is a frequent subject in research on multi-pathway somatotropic activation.",
  references: [
    { authors: "Teichman S. L. et al.", year: 2006, title: "Prolonged stimulation of GH and IGF-I secretion by CJC-1295." },
    { authors: "Raun K. et al.", year: 1998, title: "Ipamorelin, the first selective growth hormone secretagogue." },
  ],
  components: ["ipamorelin"],
};

const KLOW: ProductResearch = {
  overview:
    "KLOW is a research blend pairing GHK-Cu with three additional peptides studied for cellular signaling and connective-tissue modeling. The blend has been explored in dermal-fibroblast research and connective-tissue preclinical models.",
  history:
    "KLOW emerged as a research combination drawing on individual literature for each component peptide, particularly GHK-Cu's well-documented dermal and matrix signaling profile.",
  structures: [
    {
      name: "GHK-Cu",
      cas: "89030-95-5",
      molecularFormula: "C₁₄H₂₃CuN₆O₄",
      molecularWeight: "402.91 g/mol",
      pubchemId: "73587",
    },
  ],
  researchFindings:
    "Research on the components of KLOW has explored dermal fibroblast signaling, collagen organization, and connective-tissue remodeling pathways in vitro and in preclinical models.",
  keyAreas: [
    "Dermal: fibroblast signaling, collagen",
    "Connective: matrix remodeling",
    "Copper: GHK-Cu metalloprotein pathway",
  ],
  closingSummary:
    "KLOW is studied in research models of multi-pathway dermal and connective-tissue signaling.",
  references: [
    { authors: "Pickart L. et al.", year: 2015, title: "GHK peptide as a natural modulator of multiple cellular pathways in skin regeneration." },
  ],
  components: ["ghk-cu"],
};

// ─────────────────────────────────────────────────────────────────────────
// Stacks (assembled from component peptide research)
// ─────────────────────────────────────────────────────────────────────────

const VIORA_PREMIUM_WEIGHT_LOSS: ProductResearch = {
  overview:
    "The Premium Weight Loss Stack pairs metabolic-receptor research peptides with the mitochondrial peptide MOTS-c. Research has explored each component's signaling pathway alongside studies of combined metabolic-flexibility models.",
  history:
    "This stack draws on parallel research lines in incretin biology, growth-hormone axis modulation, and mitochondrial-derived peptide signaling, combining three actively studied peptides for multi-pathway metabolic research.",
  structures: GLP_3_RETA.structures
    .concat(TESAMORELIN.structures)
    .concat(MOTS_C.structures),
  researchFindings:
    "Each component has its own preclinical literature: tri-agonist incretin signaling, somatotropic-axis modulation, and mitochondrial-derived peptide pathways. Research stacks like this are used to investigate cross-pathway metabolic interactions.",
  keyAreas: [
    "Metabolic: incretin + somatotropic + mitochondrial",
    "Composition: body-composition signaling research",
    "Pathway: AMPK, GLP-1R, GHRH-R cross-talk",
  ],
  closingSummary:
    "This stack is among the more complex multi-pathway research combinations available, supporting studies on parallel metabolic signaling.",
  references: [
    ...GLP_3_RETA.references.slice(0, 2),
    ...TESAMORELIN.references.slice(0, 1),
    ...MOTS_C.references.slice(0, 1),
  ],
  components: ["glp-3-reta", "tesamorelin", "mots-c"],
};

const VIORA_WEIGHT_LOSS: ProductResearch = {
  overview:
    "The Weight Loss Stack combines Tesamorelin and Retatrutide for research on the somatotropic and incretin axes in metabolic and body-composition models.",
  history:
    "Both components emerged from major lines of endocrinology and incretin research in the 2000s–2010s, with extensive published preclinical and human data.",
  structures: TESAMORELIN.structures.concat(GLP_3_RETA.structures),
  researchFindings:
    "Research on these components individually documents action on visceral adiposity, GH/IGF-1 dynamics, and tri-agonist metabolic receptor signaling.",
  keyAreas: [
    "Somatotropic: GHRH receptor signaling",
    "Incretin: GLP-1/GIP/glucagon pathway",
    "Composition: body composition modeling",
  ],
  closingSummary:
    "Combination is studied in research models for multi-pathway metabolic activation.",
  references: [
    ...TESAMORELIN.references.slice(0, 2),
    ...GLP_3_RETA.references.slice(0, 2),
  ],
  components: ["tesamorelin", "glp-3-reta"],
};

const VIORA_METABOLIC: ProductResearch = {
  overview:
    "The Metabolic Stack combines Retatrutide, MOTS-c, and NAD+ for research on multi-pathway metabolic signaling, mitochondrial biology, and incretin receptor activation.",
  history:
    "Each component represents an active research area: tri-agonist incretins, mitochondrial-derived peptides, and central coenzymes of cellular metabolism.",
  structures: GLP_3_RETA.structures.concat(MOTS_C.structures).concat(NAD_PLUS.structures),
  researchFindings:
    "Research models combining these compounds study cross-talk between incretin receptors, mitochondrial signaling, and cellular energy state.",
  keyAreas: [
    "Incretin: GLP-1/GIP/glucagon co-activation",
    "Mitochondrial: MOTS-c, NAD+ axis",
    "Energy state: AMPK, sirtuin signaling",
  ],
  closingSummary:
    "A research stack designed for multi-axis metabolic investigation.",
  references: [
    ...GLP_3_RETA.references.slice(0, 1),
    ...MOTS_C.references.slice(0, 1),
    ...NAD_PLUS.references.slice(0, 1),
  ],
  components: ["glp-3-reta", "mots-c", "nad-plus"],
};

const VIORA_GUT_HEALTH: ProductResearch = {
  overview:
    "The Gut Health Stack combines BPC-157 and GLP-2-T for research on intestinal epithelial dynamics, mucosal architecture, and gastric tissue signaling.",
  history:
    "Both peptides have substantial individual research records on gastrointestinal models, with complementary mechanisms targeting epithelial signaling and barrier dynamics.",
  structures: BPC_157.structures.concat(GLP_2_T.structures),
  researchFindings:
    "Research on these components has explored gastric and intestinal models concerning epithelial proliferation, mucosal modeling, and signaling pathway activity.",
  keyAreas: [
    "Intestinal: GLP-2-T epithelial signaling",
    "Gastric: BPC-157 mucosal models",
    "Barrier: tight-junction research",
  ],
  closingSummary:
    "A research combination for multi-pathway gastrointestinal investigation.",
  references: [
    ...BPC_157.references.slice(0, 2),
    ...GLP_2_T.references.slice(0, 1),
  ],
  components: ["bpc-157", "glp-2-t"],
};

const VIORA_LONGEVITY: ProductResearch = {
  overview:
    "The Longevity Stack combines NAD+, MOTS-c, and GHK-Cu for research on cellular metabolism, mitochondrial signaling, and connective-tissue modeling in aging-related models.",
  history:
    "Each component is studied in age-related research: NAD+ in cellular metabolism, MOTS-c as a mitochondrial-derived peptide, and GHK-Cu in connective tissue and dermal aging models.",
  structures: NAD_PLUS.structures.concat(MOTS_C.structures).concat(GHK_CU.structures),
  researchFindings:
    "Research on these components individually has explored age-correlated changes in cellular metabolism, mitochondrial function, and connective-tissue signaling.",
  keyAreas: [
    "Mitochondrial: NAD+ + MOTS-c axis",
    "Connective: GHK-Cu dermal signaling",
    "Aging: age-correlated pathway studies",
  ],
  closingSummary:
    "A multi-system research stack for aging-related preclinical investigation.",
  references: [
    ...NAD_PLUS.references.slice(0, 1),
    ...MOTS_C.references.slice(0, 1),
    ...GHK_CU.references.slice(0, 1),
  ],
  components: ["nad-plus", "mots-c", "ghk-cu"],
};

const VIORA_HORMONE_SIGNALING: ProductResearch = {
  overview:
    "The Hormone Signaling Stack pairs Tesamorelin, Ipamorelin, and IGF-1 LR3 for research on the somatotropic axis at multiple levels: GHRH receptor, ghrelin receptor, and downstream IGF signaling.",
  history:
    "Each component targets a different step of the GH/IGF axis. The combination is studied in research models for full-axis somatotropic activation.",
  structures: TESAMORELIN.structures
    .concat(IPAMORELIN.structures)
    .concat(IGF_1_LR3.structures),
  researchFindings:
    "Research models combining these peptides explore pulsatile GH release, IGF-1 axis dynamics, and downstream cellular signaling.",
  keyAreas: [
    "Somatotropic: GHRH-R + GHSR-1a",
    "IGF axis: downstream signaling",
    "Endocrine: full-axis activation models",
  ],
  closingSummary:
    "A comprehensive somatotropic-axis research stack.",
  references: [
    ...TESAMORELIN.references.slice(0, 1),
    ...IPAMORELIN.references.slice(0, 1),
    ...IGF_1_LR3.references.slice(0, 1),
  ],
  components: ["tesamorelin", "ipamorelin", "igf-1-lr3"],
};

const VIORA_MOOD_BALANCE: ProductResearch = {
  overview:
    "The Mood Balance Stack combines Selank, Semax, and Oxytocin for research on neuropeptide signaling pathways in behavioral, neurotrophic, and social-cognitive models.",
  history:
    "Each component is a well-studied neuropeptide with distinct mechanisms: GABAergic modulation, BDNF/NGF expression, and oxytocin receptor signaling.",
  structures: SELANK.structures.concat(SEMAX.structures).concat(OXYTOCIN.structures),
  researchFindings:
    "Research on these components has documented their action on neurotrophic factor expression, neurotransmitter pathways, and behavioral models.",
  keyAreas: [
    "Neurotrophic: BDNF, NGF (Selank, Semax)",
    "Oxytocinergic: social and stress signaling",
    "Behavioral: anxiolytic and cognitive models",
  ],
  closingSummary:
    "A multi-pathway neuropeptide research stack.",
  references: [
    ...SELANK.references.slice(0, 1),
    ...SEMAX.references.slice(0, 1),
    ...OXYTOCIN.references.slice(0, 1),
  ],
  components: ["selank", "semax", "oxytocin"],
};

const VIORA_INTIMACY: ProductResearch = {
  overview:
    "The Intimacy Research Stack combines PT-141 (Bremelanotide) and Oxytocin for research on melanocortin and oxytocin signaling pathways relevant to social and physiological models.",
  history:
    "PT-141 emerged from melanocortin research; oxytocin is among the most studied neuropeptides in social and physiological models. The combination is used in research on cross-pathway interaction.",
  structures: PT_141.structures.concat(OXYTOCIN.structures),
  researchFindings:
    "Research on these components has explored melanocortin receptor signaling, oxytocin receptor biology, and behavioral models in animal systems.",
  keyAreas: [
    "Melanocortin: MC3R/MC4R signaling",
    "Oxytocinergic: receptor binding",
    "Behavioral: animal-model studies",
  ],
  closingSummary:
    "Research combination for cross-pathway neuropeptide investigation.",
  references: [
    ...PT_141.references.slice(0, 1),
    ...OXYTOCIN.references.slice(0, 1),
  ],
  components: ["pt-141", "oxytocin"],
};

const VIORA_CEO: ProductResearch = {
  overview:
    "The CEO Stack combines NAD+, Semax, and Selank for research on cellular metabolism, neurotrophic signaling, and neuropeptide pathways relevant to cognitive-performance preclinical models.",
  history:
    "Each component is a well-studied research peptide or coenzyme: NAD+ in cellular energy metabolism, Semax and Selank in Russian neuropeptide pharmacology.",
  structures: NAD_PLUS.structures.concat(SEMAX.structures).concat(SELANK.structures),
  researchFindings:
    "Research models combining these have explored cognitive, neurotrophic, and metabolic signaling intersections.",
  keyAreas: [
    "Metabolic: NAD+ cellular energy",
    "Neurotrophic: BDNF, NGF expression",
    "Cognitive: rodent learning models",
  ],
  closingSummary:
    "A research stack for cognitive-metabolic preclinical investigation.",
  references: [
    ...NAD_PLUS.references.slice(0, 1),
    ...SEMAX.references.slice(0, 1),
    ...SELANK.references.slice(0, 1),
  ],
  components: ["nad-plus", "semax", "selank"],
};

// ─────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────

export const PRODUCT_RESEARCH: Record<string, ProductResearch> = {
  // Individual peptides
  "bpc-157": BPC_157,
  "glp-2-t": GLP_2_T,
  "glp-3-reta": GLP_3_RETA,
  tesamorelin: TESAMORELIN,
  "mots-c": MOTS_C,
  "ghk-cu": GHK_CU,
  ipamorelin: IPAMORELIN,
  "igf-1-lr3": IGF_1_LR3,
  "nad-plus": NAD_PLUS,
  "pt-141": PT_141,
  selank: SELANK,
  semax: SEMAX,
  oxytocin: OXYTOCIN,

  // Blends
  "bpc-tb-500": BPC_TB_500,
  "cjc-1295-ipamorelin": CJC_1295_IPAMORELIN,
  klow: KLOW,

  // Stacks
  "viora-premium-weight-loss-stack": VIORA_PREMIUM_WEIGHT_LOSS,
  "viora-weight-loss-stack": VIORA_WEIGHT_LOSS,
  "viora-metabolic-stack": VIORA_METABOLIC,
  "viora-gut-health-stack": VIORA_GUT_HEALTH,
  "viora-longevity-stack": VIORA_LONGEVITY,
  "viora-hormone-signaling-stack": VIORA_HORMONE_SIGNALING,
  "viora-mood-balance-stack": VIORA_MOOD_BALANCE,
  "viora-intimacy-research-stack": VIORA_INTIMACY,
  "viora-ceo-stack": VIORA_CEO,
};

export function getProductResearch(slug: string): ProductResearch | undefined {
  return PRODUCT_RESEARCH[slug];
}

// ─────────────────────────────────────────────────────────────────────────
// Article adapter — surfaces every product-research entry as a library
// Article so it appears in /research alongside hand-written long-form work.
// Marvin asked for "a research doc for each SKU we sell in the library based
// on the stuff you add for each product." This is the wiring.
// ─────────────────────────────────────────────────────────────────────────

import type { Article } from "./articles";
import type { Product } from "./products";

/**
 * Build a library Article for a single product slug from its research data.
 * Returns null if either the product or research entry is missing.
 *
 * Image strategy:
 *  - heroImage: pulled from the Product's own image field (a real .webp path)
 *  - heroPeptides: for stacks/blends with components, returns the component
 *    slugs so the ProductPhoto composer renders a multi-vial composition.
 *    For individual peptides this stays null so a single-vial render is used.
 */
export function productResearchToArticle(
  slug: string,
  product: Product,
): Article | null {
  const r = PRODUCT_RESEARCH[slug];
  if (!r) return null;

  const productName = product.name;

  // Section list — mirrors the on-product layout for consistency.
  const body: Article["body"] = [
    { type: "h2", text: "Overview" },
    { type: "p", text: r.overview },
    { type: "h2", text: "History" },
    { type: "p", text: r.history },
  ];

  for (const s of r.structures) {
    body.push({ type: "h2", text: `${s.name} Structure` });
    body.push({
      type: "ul",
      items: [
        `CAS #: ${s.cas}`,
        `Molecular Formula: ${s.molecularFormula}`,
        `Molecular Weight: ${s.molecularWeight}`,
        ...(s.pubchemId ? [`PubChem ID: ${s.pubchemId}`] : []),
      ],
    });
  }

  body.push({ type: "h2", text: "Research Findings" });
  body.push({ type: "p", text: r.researchFindings });
  body.push({ type: "h3", text: "Key Areas of Research" });
  body.push({ type: "ul", items: r.keyAreas });
  body.push({ type: "p", text: r.closingSummary });

  // For stacks/blends with explicit component peptides, render the article
  // hero as a multi-vial composite. For individual peptides, just use the
  // product's own image — heroPeptides stays undefined so a single vial
  // renders.
  const heroPeptides =
    r.components && r.components.length >= 2 ? r.components : undefined;

  return {
    slug: `profile-${slug}`,
    title: `${productName} — Research Profile`,
    category: "Compound Profile",
    excerpt: r.overview.length > 200 ? `${r.overview.slice(0, 197)}...` : r.overview,
    publishedAt: "2026-05-12",
    readMinutes: Math.max(3, Math.ceil(r.overview.length / 600) + r.structures.length),
    body,
    heroImage: product.image,
    heroPeptides,
    references: r.references.map((ref) => ({
      authors: ref.authors,
      title: ref.title,
      year: ref.year,
    })),
    relatedProductSlugs: [slug],
  };
}

