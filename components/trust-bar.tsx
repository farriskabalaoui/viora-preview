"use client";

import { useI18n } from "@/lib/i18n-context";
import type { DictKey } from "@/lib/i18n";

const items: { titleKey: DictKey; bodyKey: DictKey }[] = [
  { titleKey: "trust.tested", bodyKey: "trust.tested_body" },
  { titleKey: "trust.physician", bodyKey: "trust.physician_body" },
  { titleKey: "trust.us", bodyKey: "trust.us_body" },
  { titleKey: "trust.portal", bodyKey: "trust.portal_body" },
];

export function TrustBar() {
  const { t } = useI18n();
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.titleKey} className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 flex-none rounded-full bg-brand" />
            <div>
              <div className="text-sm font-semibold text-foreground">
                {t(it.titleKey)}
              </div>
              <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {t(it.bodyKey)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
