"use client";

import { useI18n } from "@/lib/i18n-context";

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "es" : "en")}
      aria-label={lang === "en" ? "Switch to Spanish" : "Cambiar a inglés"}
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground/75 transition-colors hover:border-brand hover:text-brand ${className}`}
    >
      <span aria-hidden className={lang === "en" ? "text-brand" : "opacity-50"}>
        EN
      </span>
      <span aria-hidden className="opacity-30">·</span>
      <span aria-hidden className={lang === "es" ? "text-brand" : "opacity-50"}>
        ES
      </span>
    </button>
  );
}
