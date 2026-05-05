import { NextResponse } from "next/server";
import { products } from "@/lib/products";

type Msg = { role: "user" | "assistant"; content: string };

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: Msg[] };
  const last = messages.filter((m) => m.role === "user").pop();
  const text = (last?.content || "").toLowerCase();

  const reply = generateReply(text);
  return NextResponse.json({ reply });
}

function generateReply(text: string): string {
  // Match against product names
  const matched = products.find((p) =>
    text.includes(p.name.toLowerCase()) ||
    text.includes(p.slug.replace(/-/g, " ")),
  );

  if (matched) {
    return `${matched.name} — ${matched.short}\n\nStarting at $${matched.priceFrom}${matched.priceMax ? ` (up to $${matched.priceMax})` : ""}, ${matched.purity}. Want me to send the COA or open the product page?`;
  }

  if (/coa|certificate|purity|hplc|verif/.test(text)) {
    return "Every Viora batch is independently HPLC + mass-spec verified. We publish recent COAs publicly — Tesamorelin, MOTS-c, GHK-Cu, and Retatrutide are all live on /research#coa. For a specific batch lot, our team can pull it for you.";
  }

  if (/ship|deliver|when|june|order|launch/.test(text)) {
    return "Orders begin shipping June 1, 2026. We ship discreet, temperature-controlled packages from our U.S. facility — typically 2-3 business days. You can apply for portal access today so you're approved by launch.";
  }

  if (/account|portal|sign|login|access|apply/.test(text)) {
    return "Portal access is open to verified researchers and clinicians (21+). Apply through our contact form and our team typically approves within one business day. Want me to send you the link?";
  }

  if (/stack|blend|protocol/.test(text)) {
    const stacks = products.filter((p) => p.category === "Stack");
    const list = stacks.slice(0, 4).map((s) => `• ${s.name} — from $${s.priceFrom}`).join("\n");
    return `We offer 9 pre-built research stacks. Most popular:\n\n${list}\n\nWant me to recommend one based on your research focus?`;
  }

  if (/weight|metabolic|fat|glp/.test(text)) {
    return "For metabolic research we offer GLP-3 (Reta) and GLP-2 (T) as single peptides, plus pre-built stacks: Viora Weight Loss Stack ($303), Viora Premium Weight Loss Stack ($388 — adds MOTS-c), and the Metabolic Stack ($430). All HPLC verified, COAs published.";
  }

  if (/recovery|injury|tissue|bpc|tb-?500|tb500/.test(text)) {
    return "For recovery research, BPC-157 ($25 from) and TB-500 are the two most-cited compounds — we sell them individually and as a pre-blended BPC-157/TB-500 stack ($75). All HPLC verified.";
  }

  if (/cognit|focus|memory|nootropic|semax|selank/.test(text)) {
    return "Cognitive research compounds in the catalog: Selank ($25) and Semax ($25), plus the Viora CEO Stack ($100) and Mood & Balance Stack ($70). Want product pages?";
  }

  if (/anti.?aging|longevity|nad|mots|aging/.test(text)) {
    return "For longevity research: NAD+ ($43+), MOTS-c ($25+), GHK-Cu ($22+), and the Viora Longevity Stack ($189). Each is HPLC verified with published COAs.";
  }

  if (/contact|email|talk|human|representative|call/.test(text)) {
    return "Easiest way: research@viorahealthcare.com or use the contact form on /contact. Our team replies within one business day.";
  }

  if (/hello|hi|hey|good (morning|afternoon|evening)/.test(text)) {
    return "Hi! I can help with compound details, COAs, pricing, shipping, or portal access. What are you researching?";
  }

  if (/price|cost|how much/.test(text)) {
    return "Single peptides start at $19 (Ipamorelin); pre-built research stacks range from $50 (Intimacy) to $430 (Metabolic). Bulk and institutional pricing available — drop a note on /contact.";
  }

  return "I can help with compound details, COAs, pricing, portal access, or shipping. Try asking about a specific peptide (e.g. 'tell me about BPC-157') or a research focus (e.g. 'what do you have for recovery?').";
}
