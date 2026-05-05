"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { LANG_LABELS, type Lang } from "@/lib/i18n";

const ORDER: { code: Lang; short: string; label: string }[] = [
  { code: "en", short: "EN", label: LANG_LABELS.en },
  { code: "es", short: "ES", label: LANG_LABELS.es },
  { code: "ar", short: "AR", label: LANG_LABELS.ar },
];

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const current = ORDER.find((l) => l.code === lang) ?? ORDER[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground/75 transition-colors hover:border-brand hover:text-brand"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {current.short}
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-xl border border-border bg-background shadow-lg"
          dir="ltr"
        >
          {ORDER.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-muted ${
                l.code === lang ? "bg-brand-soft text-brand" : "text-foreground"
              }`}
            >
              <span>{l.label}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {l.short}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
