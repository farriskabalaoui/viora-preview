"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { dict, RTL_LANGS, type DictKey, type Lang } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
  rtl: boolean;
};

const I18nContext = createContext<Ctx | null>(null);

const VALID_LANGS: Lang[] = ["en", "es", "ar"];

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("viora-lang") as Lang | null;
      if (saved && VALID_LANGS.includes(saved)) setLangState(saved);
    } catch {}
  }, []);

  // Apply dir + lang to <html> for RTL languages
  useEffect(() => {
    if (typeof document === "undefined") return;
    const isRtl = RTL_LANGS.includes(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("viora-lang", l);
    } catch {}
  }, []);

  const t = useCallback(
    (key: DictKey) => dict[lang][key] ?? dict.en[key] ?? key,
    [lang],
  );

  const rtl = RTL_LANGS.includes(lang);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, rtl }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
