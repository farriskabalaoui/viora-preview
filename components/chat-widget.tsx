"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Hi — I'm **Vee**, Viora's research assistant. Ask me about a compound, COAs, shipping, or which stack fits your research focus. I'm here to make this easy.",
};

const SUGGESTIONS = [
  "What's BPC-157?",
  "Recommend a recovery stack",
  "Show me your COAs",
  "When do orders ship?",
];

function renderInline(text: string) {
  // Renders a tiny subset of markdown: links, bold, line breaks.
  const out: React.ReactNode[] = [];
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  const boldRe = /\*\*([^*]+)\*\*/g;
  let cursor = 0;
  let key = 0;
  // First pass: split by links
  const linkMatches: { start: number; end: number; label: string; href: string }[] = [];
  for (const m of text.matchAll(linkRe)) {
    linkMatches.push({
      start: m.index!,
      end: m.index! + m[0].length,
      label: m[1],
      href: m[2],
    });
  }
  const renderText = (chunk: string) => {
    // bold → <strong>; rest plain
    const parts: React.ReactNode[] = [];
    let i = 0;
    for (const b of chunk.matchAll(boldRe)) {
      if (b.index! > i) parts.push(chunk.slice(i, b.index));
      parts.push(<strong key={`b${key++}`}>{b[1]}</strong>);
      i = b.index! + b[0].length;
    }
    if (i < chunk.length) parts.push(chunk.slice(i));
    return parts;
  };
  for (const m of linkMatches) {
    if (m.start > cursor) out.push(<span key={`t${key++}`}>{renderText(text.slice(cursor, m.start))}</span>);
    const isExternal = m.href.startsWith("http");
    out.push(
      <a
        key={`l${key++}`}
        href={m.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className="font-medium text-brand underline underline-offset-2 hover:no-underline"
      >
        {m.label}
      </a>,
    );
    cursor = m.end;
  }
  if (cursor < text.length) out.push(<span key={`t${key++}`}>{renderText(text.slice(cursor))}</span>);
  return out;
}

function renderMessage(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {renderInline(line)}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [unread, setUnread] = useState(true);
  const [teaser, setTeaser] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Proactive greeting bubble — shows once per session after a short delay
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname?.startsWith("/growth")) return;
    if (open) return;
    try {
      if (sessionStorage.getItem("vee-teaser-seen")) return;
    } catch {}
    const timer = setTimeout(() => setTeaser(true), 2200);
    return () => clearTimeout(timer);
  }, [pathname, open]);

  function dismissTeaser() {
    setTeaser(false);
    try {
      sessionStorage.setItem("vee-teaser-seen", "1");
    } catch {}
  }

  useEffect(() => {
    if (open) {
      setUnread(false);
      dismissTeaser();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streaming]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    setInput("");

    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setStreaming(true);

    // Add empty assistant message we'll fill in as tokens arrive
    setMessages((cur) => [...cur, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";
        for (const ev of events) {
          const line = ev.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload);
            if (json.delta) {
              acc += json.delta;
              setMessages((cur) => {
                const copy = [...cur];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            } else if (json.error) {
              throw new Error(json.error);
            }
          } catch {
            /* ignore parse errors mid-stream */
          }
        }
      }

      if (!acc.trim()) throw new Error("empty response");
    } catch (err) {
      console.error(err);
      setMessages((cur) => {
        const copy = [...cur];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "Sorry — I couldn't reach our system. Email research@viorahealthcare.com and our team will jump in.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  if (pathname?.startsWith("/growth")) return null;

  return (
    <>
      {/* Proactive greeting teaser */}
      {!open && teaser && (
        <div className="fixed bottom-[78px] right-5 z-50 w-[280px] sm:w-[300px]">
          <div className="relative rounded-2xl border border-border bg-background p-4 shadow-xl ring-1 ring-black/5">
            <button
              onClick={dismissTeaser}
              aria-label="Dismiss"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="flex gap-3">
              <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand text-brand-foreground">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="pr-4">
                <div className="text-sm font-semibold text-foreground">Hi, I'm Vee 👋</div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Looking for a compound, COA, or stack recommendation? I'm here to make it easy.
                </p>
                <button
                  onClick={() => {
                    setOpen(true);
                    dismissTeaser();
                  }}
                  className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                >
                  Start chatting
                  <span aria-hidden>→</span>
                </button>
              </div>
            </div>
            {/* Pointer triangle pointing down to button */}
            <div className="absolute -bottom-2 right-7 h-4 w-4 rotate-45 border-b border-r border-border bg-background" />
          </div>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-medium text-brand-foreground shadow-lg shadow-brand/20 transition-transform hover:-translate-y-0.5"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          Ask Vee
          {(unread || teaser) && (
            <span className="ml-1 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold text-brand">
              1
            </span>
          )}
        </button>
      )}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[600px] max-h-[85vh] w-[400px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-brand px-4 py-3 text-brand-foreground">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Vee · Viora Research Assistant
              </div>
              <div className="mt-0.5 text-[11px] text-brand-foreground/70">
                Powered by Claude · Replies stream in real-time
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-md p-1 text-brand-foreground/80 transition-colors hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-muted/30 px-4 py-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-sm bg-brand text-brand-foreground"
                      : "rounded-bl-sm bg-background text-foreground shadow-sm"
                  }`}
                >
                  {m.content ? (
                    renderMessage(m.content)
                  ) : (
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.1s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Suggested prompts (only on first turn) */}
            {messages.length === 1 && !streaming && (
              <div className="mt-4 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={onSubmit}
            className="flex gap-2 border-t border-border bg-background p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a compound, COA, stack…"
              disabled={streaming}
              className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {streaming ? "…" : "Send"}
            </button>
          </form>
          <div className="border-t border-border bg-background px-3 pb-2 pt-1 text-center text-[10px] text-muted-foreground">
            For research use only · Vee can be wrong — verify clinical questions with our team
          </div>
        </div>
      )}
    </>
  );
}
