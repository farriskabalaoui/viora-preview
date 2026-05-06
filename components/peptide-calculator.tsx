"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Syringe = {
  mlMax: number;
  label: string;
  subLabel: string;
  unitsMax: number;
  photo: string;
};

const SYRINGES: Syringe[] = [
  { mlMax: 0.3, label: "0.3ml", subLabel: "U-30", unitsMax: 30, photo: "/calculator/syringe-0.3ml-t.png" },
  { mlMax: 0.5, label: "0.5ml", subLabel: "U-50", unitsMax: 50, photo: "/calculator/syringe-0.5ml-t.png" },
  { mlMax: 1.0, label: "1ml", subLabel: "U-100", unitsMax: 100, photo: "/calculator/syringe-1.0ml-t.png" },
];

const VIAL_PRESETS = [2, 3, 5, 10, 15];
const WATER_PRESETS = [1, 2, 3, 5];
const DOSE_PRESETS: { mg: number; label: string }[] = [
  { mg: 0.05, label: "50mcg" },
  { mg: 0.1, label: "100mcg" },
  { mg: 0.25, label: "250mcg" },
  { mg: 0.5, label: "500mcg" },
  { mg: 1, label: "1mg" },
  { mg: 2.5, label: "2.5mg" },
];

type QuickPick = { label: string; vialMg: number; waterMl: number; doseMg: number };
const QUICK_PICKS: QuickPick[] = [
  { label: "BPC-157", vialMg: 5, waterMl: 2, doseMg: 0.25 },
  { label: "Tesamorelin", vialMg: 10, waterMl: 3, doseMg: 1 },
  { label: "Ipamorelin", vialMg: 5, waterMl: 2, doseMg: 0.2 },
  { label: "GHK-Cu", vialMg: 50, waterMl: 5, doseMg: 2 },
  { label: "Semax", vialMg: 30, waterMl: 3, doseMg: 0.5 },
  { label: "GLP-3 (Reta)", vialMg: 10, waterMl: 2, doseMg: 2 },
];

function formatMg(mg: number): string {
  if (mg >= 1) return `${Number(mg.toFixed(3))} mg`;
  return `${Number((mg * 1000).toFixed(2))} mcg`;
}

export function PeptideCalculator() {
  const [syringe, setSyringe] = useState<Syringe>(SYRINGES[0]);
  const [vialMg, setVialMg] = useState<number>(10);
  const [vialOther, setVialOther] = useState("");
  const [vialIsOther, setVialIsOther] = useState(false);

  const [waterMl, setWaterMl] = useState<number>(5);
  const [waterOther, setWaterOther] = useState("");
  const [waterIsOther, setWaterIsOther] = useState(false);

  const [doseMg, setDoseMg] = useState<number>(0.05);
  const [doseOther, setDoseOther] = useState("");
  const [doseUnit, setDoseUnit] = useState<"mcg" | "mg">("mcg");
  const [doseIsOther, setDoseIsOther] = useState(false);

  const result = useMemo(() => {
    if (vialMg <= 0 || waterMl <= 0 || doseMg <= 0) return null;
    const concentrationMgPerMl = vialMg / waterMl;
    const drawMl = doseMg / concentrationMgPerMl;
    const drawUnits = drawMl * 100;
    const overflow = drawUnits > syringe.unitsMax;
    return { concentrationMgPerMl, drawMl, drawUnits, overflow };
  }, [vialMg, waterMl, doseMg, syringe.unitsMax]);

  function applyQuickPick(q: QuickPick) {
    setVialMg(q.vialMg);
    setVialIsOther(!VIAL_PRESETS.includes(q.vialMg));
    setVialOther(VIAL_PRESETS.includes(q.vialMg) ? "" : String(q.vialMg));
    setWaterMl(q.waterMl);
    setWaterIsOther(!WATER_PRESETS.includes(q.waterMl));
    setWaterOther(WATER_PRESETS.includes(q.waterMl) ? "" : String(q.waterMl));
    setDoseMg(q.doseMg);
    const isPreset = DOSE_PRESETS.some((d) => Math.abs(d.mg - q.doseMg) < 0.0001);
    setDoseIsOther(!isPreset);
    if (!isPreset) {
      if (q.doseMg < 1) {
        setDoseUnit("mcg");
        setDoseOther(String(q.doseMg * 1000));
      } else {
        setDoseUnit("mg");
        setDoseOther(String(q.doseMg));
      }
    } else {
      setDoseOther("");
    }
  }

  return (
    <div>
      {/* Title — compact */}
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand sm:text-4xl">
          Peptide Calculator
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-foreground/70">
          Easily calculate accurate dosages by selecting your parameters with our{" "}
          <strong className="text-foreground">Peptide Reconstitution Calculator</strong>{" "}
          below.
        </p>
      </div>

      {/* Quick picks — compact single row */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
        <span className="mr-1 text-xs text-foreground/55">Quick start:</span>
        {QUICK_PICKS.map((q) => (
          <button
            key={q.label}
            onClick={() => applyQuickPick(q)}
            className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground/80 transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Inputs — 2 column compact */}
      <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-2">
        {/* LEFT: Syringe */}
        <div>
          <h3 className="font-display text-base font-bold text-foreground">
            What is the total volume of your syringe?
          </h3>
          <div className="mt-3 space-y-2">
            {SYRINGES.map((s) => {
              const selected = s.mlMax === syringe.mlMax;
              return (
                <button
                  key={s.label}
                  onClick={() => setSyringe(s)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all ${
                    selected
                      ? "border-brand bg-brand-soft"
                      : "border-border bg-background hover:border-brand/40 hover:bg-muted/40"
                  }`}
                >
                  <span
                    className={`w-14 flex-none font-display text-sm font-bold ${
                      selected ? "text-brand" : "text-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                  <div className="relative h-9 flex-1">
                    <Image
                      src={s.photo}
                      alt={`${s.label} insulin syringe`}
                      fill
                      sizes="240px"
                      className={`object-contain object-left transition-opacity ${selected ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: vial / water / dose stacked tightly */}
        <div className="space-y-5">
          <CompactInput
            icon={<TinyVial photo="/calculator/vial-bpc-t.png" />}
            title="Select Peptide Vial Quantity"
            presets={VIAL_PRESETS.map((mg) => ({ value: mg, label: `${mg}mg` }))}
            value={vialMg}
            isOther={vialIsOther}
            otherText={vialOther}
            onSelectPreset={(v) => {
              setVialMg(v);
              setVialIsOther(false);
              setVialOther("");
            }}
            onOther={(text) => {
              setVialIsOther(true);
              setVialOther(text);
              const n = Number(text);
              if (!isNaN(n) && n > 0) setVialMg(n);
            }}
            otherSuffix="mg"
            otherPlaceholder="Enter vial quantity (mg)"
          />

          <CompactInput
            icon={<TinyVial photo="/calculator/vial-blend-t.png" />}
            title="How much bacteriostatic water are you adding?"
            presets={WATER_PRESETS.map((ml) => ({ value: ml, label: `${ml}ml` }))}
            value={waterMl}
            isOther={waterIsOther}
            otherText={waterOther}
            onSelectPreset={(v) => {
              setWaterMl(v);
              setWaterIsOther(false);
              setWaterOther("");
            }}
            onOther={(text) => {
              setWaterIsOther(true);
              setWaterOther(text);
              const n = Number(text);
              if (!isNaN(n) && n > 0) setWaterMl(n);
            }}
            otherSuffix="ml"
            otherPlaceholder="Enter water volume (ml)"
          />

          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              How much of the peptide do you want in each dose?
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {DOSE_PRESETS.map((d) => {
                const sel = !doseIsOther && Math.abs(doseMg - d.mg) < 0.0001;
                return (
                  <button
                    key={d.label}
                    onClick={() => {
                      setDoseMg(d.mg);
                      setDoseIsOther(false);
                      setDoseOther("");
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                      sel
                        ? "bg-brand font-semibold text-brand-foreground"
                        : "border border-border bg-background text-foreground hover:border-brand hover:text-brand"
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setDoseIsOther(true);
                  if (doseOther) {
                    const n = Number(doseOther);
                    if (!isNaN(n) && n > 0)
                      setDoseMg(doseUnit === "mcg" ? n / 1000 : n);
                  }
                }}
                className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                  doseIsOther
                    ? "bg-brand font-semibold text-brand-foreground"
                    : "border border-border bg-background text-foreground hover:border-brand hover:text-brand"
                }`}
              >
                Other
              </button>
            </div>
            {doseIsOther && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={doseOther}
                  onChange={(e) => {
                    setDoseOther(e.target.value);
                    const n = Number(e.target.value);
                    if (!isNaN(n) && n > 0)
                      setDoseMg(doseUnit === "mcg" ? n / 1000 : n);
                  }}
                  placeholder="Custom amount"
                  className="w-32 rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
                <select
                  value={doseUnit}
                  onChange={(e) => {
                    const u = e.target.value as "mcg" | "mg";
                    setDoseUnit(u);
                    const n = Number(doseOther);
                    if (!isNaN(n) && n > 0) setDoseMg(u === "mcg" ? n / 1000 : n);
                  }}
                  className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-brand"
                >
                  <option value="mcg">mcg</option>
                  <option value="mg">mg</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Result — always visible, tight */}
      <div className="mt-6 border-t border-border pt-5">
        {!result ? (
          <p className="text-center text-sm text-foreground/55">
            Enter all four values to see your reconstitution.
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-base text-foreground sm:text-lg">
              Your vial concentration is{" "}
              <strong className="text-brand">
                {result.concentrationMgPerMl.toFixed(2)} mg/mL
              </strong>
              .
            </p>
            <p className="text-base text-foreground sm:text-lg">
              To achieve{" "}
              <strong className="text-brand">
                {formatMg(doseMg)} ({doseMg.toFixed(3)} mg)
              </strong>
              , draw{" "}
              <strong className="text-brand">{result.drawMl.toFixed(3)} mL</strong>{" "}
              <span className="text-foreground/65">
                ({result.drawUnits.toFixed(1)} units on a {syringe.subLabel} syringe)
              </span>
            </p>
            <SyringeScale
              unitsMax={syringe.unitsMax}
              drawUnits={result.drawUnits}
              overflow={result.overflow}
            />
            <p className="text-xs text-foreground/55">
              <strong className="text-foreground/80">Bonus tip:</strong>{" "}
              {formatMg(doseMg)} on a {result.concentrationMgPerMl.toFixed(2)} mg/mL
              vial = draw {result.drawUnits.toFixed(1)} units on a {syringe.subLabel}{" "}
              insulin syringe.
            </p>
            {result.overflow && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
                <strong>Heads up:</strong> the required draw (
                {result.drawUnits.toFixed(1)} units) exceeds your selected syringe&apos;s
                max ({syringe.unitsMax} units). Choose a larger syringe or split into
                multiple injections.
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-foreground/55">
        For research use only. Calculator is a research math tool, not medical
        guidance. All compounds for in-vitro research only.
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Compact input row (vial + bac water)                          */
/* ────────────────────────────────────────────────────────────── */

function CompactInput({
  icon,
  title,
  presets,
  value,
  isOther,
  otherText,
  onSelectPreset,
  onOther,
  otherSuffix,
  otherPlaceholder,
}: {
  icon: React.ReactNode;
  title: string;
  presets: { value: number; label: string }[];
  value: number;
  isOther: boolean;
  otherText: string;
  onSelectPreset: (v: number) => void;
  onOther: (text: string) => void;
  otherSuffix: string;
  otherPlaceholder: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-none">{icon}</div>
      <div className="flex-1">
        <h3 className="font-display text-base font-bold text-foreground">{title}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {presets.map((p) => {
            const sel = !isOther && value === p.value;
            return (
              <button
                key={p.value}
                onClick={() => onSelectPreset(p.value)}
                className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                  sel
                    ? "bg-brand font-semibold text-brand-foreground"
                    : "border border-border bg-background text-foreground hover:border-brand hover:text-brand"
                }`}
              >
                {p.label}
              </button>
            );
          })}
          <button
            onClick={() => onOther(otherText)}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
              isOther
                ? "bg-brand font-semibold text-brand-foreground"
                : "border border-border bg-background text-foreground hover:border-brand hover:text-brand"
            }`}
          >
            Other
          </button>
        </div>
        {isOther && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-foreground/60">{otherPlaceholder}</span>
            <input
              type="number"
              min="0"
              step="any"
              value={otherText}
              onChange={(e) => onOther(e.target.value)}
              className="w-24 rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <span className="text-xs text-foreground/60">{otherSuffix}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Visual elements — compact                                     */
/* ────────────────────────────────────────────────────────────── */

function SyringeIllustration({
  sizeFraction,
  selected,
}: {
  sizeFraction: number;
  selected: boolean;
}) {
  const bodyLength = 60 + sizeFraction * 80;
  const total = 200;
  const startX = (total - bodyLength - 50) / 2;
  const bodyEndX = startX + bodyLength;
  const stroke = selected ? "#284C3E" : "#7a8a7e";
  const accent = selected ? "#284C3E" : "#9aa9a0";

  return (
    <svg viewBox="0 0 200 36" className="h-7 flex-1" aria-hidden="true">
      <line x1={startX - 14} y1="18" x2={startX} y2="18" stroke={accent} strokeWidth="1.5" />
      <rect x={startX - 4} y="15" width="6" height="6" rx="1" fill={accent} />
      <rect
        x={startX}
        y="10"
        width={bodyLength}
        height="16"
        rx="2"
        fill="#ffffff"
        stroke={stroke}
        strokeWidth="1.5"
      />
      {Array.from({ length: Math.max(3, Math.round(bodyLength / 10)) }).map(
        (_, i, arr) => {
          const x = startX + ((i + 1) * bodyLength) / (arr.length + 1);
          return (
            <line
              key={i}
              x1={x}
              y1="12"
              x2={x}
              y2="16"
              stroke={stroke}
              strokeWidth="0.8"
              opacity="0.5"
            />
          );
        },
      )}
      <rect x={bodyEndX - 6} y="9" width="6" height="18" fill={accent} opacity="0.85" />
      <rect x={bodyEndX} y="14" width="32" height="8" fill="#e8a86a" />
      <rect x={bodyEndX + 32} y="6" width="6" height="24" rx="1" fill="#e8a86a" />
    </svg>
  );
}

/* Tiny vial — real Viora vial photo, transparent background */
function TinyVial({ photo }: { photo: string }) {
  return (
    <div className="relative h-14 w-10">
      <Image src={photo} alt="" fill sizes="40px" className="object-contain" />
    </div>
  );
}

function SyringeScale({
  unitsMax,
  drawUnits,
  overflow,
}: {
  unitsMax: number;
  drawUnits: number;
  overflow: boolean;
}) {
  const fillPct = Math.min(100, (drawUnits / unitsMax) * 100);
  const ticks: number[] = [];
  const step = unitsMax >= 100 ? 5 : 5;
  for (let v = 0; v <= unitsMax; v += step) ticks.push(v);

  return (
    <div className="mt-1">
      <div className="relative h-9 w-full overflow-hidden rounded-md border border-border bg-background">
        <div
          className={`absolute inset-y-0 left-0 transition-all ${
            overflow ? "bg-amber-500" : "bg-brand"
          }`}
          style={{ width: `${fillPct}%` }}
        />
        {ticks.map((t) => (
          <div
            key={t}
            className="absolute top-0 bottom-0 w-px bg-foreground/15"
            style={{ left: `${(t / unitsMax) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-0.5 grid w-full grid-flow-col text-[9px] text-foreground/55">
        {ticks.map((t) => (
          <div key={t} className="text-center" style={{ flex: 1 }}>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
