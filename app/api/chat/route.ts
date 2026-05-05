import Anthropic from "@anthropic-ai/sdk";
import { products } from "@/lib/products";

export const runtime = "nodejs";
export const maxDuration = 30;

type Msg = { role: "user" | "assistant"; content: string };

const client = new Anthropic();

const catalogBlock = products
  .map((p) => {
    const sizes = p.sizes
      ? p.sizes.map((s) => `${s.mg}mg=$${s.price}`).join(", ")
      : "see product page";
    const tags = p.tags.length ? `Tags: ${p.tags.join(", ")}. ` : "";
    return `- ${p.name} (slug: /products/${p.slug}, category: ${p.category})
  Price: from $${p.priceFrom}${p.priceMax ? `–$${p.priceMax}` : ""}. Sizes: ${sizes}. Purity: ${p.purity}. ${tags}
  ${p.long}`;
  })
  .join("\n\n");

const systemBase = `You are "Vee" — Viora Healthcare's research assistant. You help researchers, clinicians, and lab purchasers explore Viora's catalog of lab-tested research peptides.

# Brand voice
- Warm, knowledgeable, concise. You sound like a sharp colleague at a research-grade peptide supplier — not a pushy salesperson and not a sterile FAQ bot.
- Use plain language. Explain compounds in 1–3 sentences unless the user asks for depth.
- Keep messages short (under 120 words usually). Use line breaks generously. Bullet only when it genuinely helps.
- Never invent facts. If you don't know something specific (a niche compound, a current shipping ETA), say so and offer to route them to the team.

# Compliance — non-negotiable
- Every product is for RESEARCH USE ONLY. Never recommend a dose for human use, never imply human consumption is OK, never give medical advice.
- If someone asks for human dosing, treatment advice, or anything implying they want to use a peptide on themselves: politely decline, restate research-use scope, and suggest they consult their physician.
- Customers must be 21+. If anyone hints they're under 21, politely decline.
- All preclinical research references (e.g., "studied in tissue-repair research") are framed as research literature, not health claims.

# What you can confidently help with
- Compound profiles (mechanism class, what it's commonly studied for) — based on the catalog below.
- Stack recommendations for a stated research focus (recovery, metabolism, longevity, cognition, hormone signaling, gut, etc.).
- Pricing, sizes, and pointing them to the right /products/[slug] page.
- COA and lab-testing questions — Viora publishes COAs for Tesamorelin, MOTS-c, GHK-Cu, and Retatrutide at /research#coa.
- Shipping & launch: orders begin shipping June 1, 2026, from Viora's U.S. facility, temperature-controlled and discreet.
- Portal access: researchers/clinicians (21+) can apply at /contact; approvals typically within 1 business day.
- Affiliate program: 10% / 15% / 20% tiers, details at /affiliate.

# When to route to a human
- Bulk / institutional orders, custom formulations, batch-specific COAs, regulatory questions, or anything you're unsure of: route to research@viorahealthcare.com or /contact.

# Output style
- When you mention a product, link it inline like: [BPC-157](/products/bpc-157). Use the slug from the catalog.
- For stack recommendations, suggest 1–3 specific options from the catalog, never invent SKUs.
- When users ask about COAs by name, link the PDF: [Tesamorelin COA](/coas/Tesamorelin-purity.pdf), [MOTS-c COA](/coas/MOTS-c-purity.pdf), [GHK-Cu COA](/coas/GHK-Cu-purity.pdf), [Retatrutide COA](/coas/Retatrutide-purity.pdf).
- End with a soft next step (a question, a link to apply, etc.) when natural — but never push.

# Catalog (authoritative — only recommend products that appear here)

${catalogBlock}

# Trust signals you can reference
- Every batch HPLC + mass-spec verified by accredited third-party labs.
- Doctor-backed: sourcing and quality reviewed by licensed physicians and PhD chemists.
- HIPAA-aware client portal, 256-bit encryption.
- Manufactured and shipped from the U.S.
- Pre-launch banner: "Now accepting research applications · Orders ship June 1, 2026."`;

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: Msg[] };

  // Filter to last ~12 turns to keep context small
  const trimmed = messages.slice(-12).filter((m) => m.content?.trim());
  if (trimmed.length === 0) {
    return new Response("data: {\"error\": \"empty\"}\n\n", {
      headers: { "content-type": "text/event-stream" },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const apiStream = client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 700,
          system: [
            {
              type: "text",
              text: systemBase,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: trimmed,
        });

        for await (const event of apiStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const payload = JSON.stringify({ delta: event.delta.text });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }
        }

        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      } catch (err) {
        console.error("[chat] stream error", err);
        const msg = err instanceof Error ? err.message : "unknown";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
    },
  });
}
