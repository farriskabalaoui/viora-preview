"use client";

import Link from "next/link";
import { useState } from "react";
import { PolarisLogo } from "@/components/polaris-logo";

const NAV = [
  { href: "#services", label: "Services" },
  { href: "#methods", label: "Methods" },
  { href: "#verify", label: "Verify a COA", primary: true },
  { href: "#contact", label: "Contact" },
];

export function PolarisHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-[#e4e8ee] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/polaris"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2"
        >
          <PolarisLogo />
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-[#1a2342]">
              POLARIS
            </span>
            <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.25em] text-[#5a6a7e]">
              Analytical
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-7 sm:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={
                item.primary
                  ? "text-sm font-semibold text-[#0a4d6f]"
                  : "text-sm text-[#1a2342]/75 hover:text-[#0a4d6f]"
              }
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#cdd5e0] text-[#1a2342] hover:border-[#0a4d6f] hover:text-[#0a4d6f] sm:hidden"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-[#e4e8ee] bg-white sm:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`border-b border-[#f0f3f7] py-3 text-base font-medium last:border-b-0 ${
                  item.primary ? "text-[#0a4d6f]" : "text-[#1a2342] hover:text-[#0a4d6f]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

