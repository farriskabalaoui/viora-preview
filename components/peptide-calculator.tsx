"use client";

import { useMemo, useState } from "react";

type Syringe = { mlMax: number; label: string; subLabel: string; unitsMax: number };

const SYRINGES: Syringe[] = [
  { mlMax: 0.3, label: "0.3 mL", subLabel: "U-30 insulin", unitsMax: 30 },
  { mlMax: 0.5, label: "0.5 mL", subLabel: "U-50 insulin", unitsMax: 50 },
  { mlMax: 1.0, label: "1.0 mL", subLabel: "U-100 insulin", unitsMax: 100 },
];

const VIAL_PRESETS = [2, 3, 5, 10, 15];
const WATER_PRESETS = [1, 2, 3, 5];
const DOSE_PRESETS: { mg: number; label: string }[] = [
  { mg: 0.05, label: "50 mcg" },
  { mg: 0.1, label: "100 mcg" },
  { mg: 0.25, label: "250 mcg" },
  { mg: 0.5, label: "500 mcg" },
  { mg: 1, label: "1 mg" },
  { mg: 2.5, label: "2.5 mg" },
];

type QuickPick = {
  label: string;
  vialMg: number;
  waterMl: number;
  doseMg: number;
};

const QUICK_PICKS: QuickPick[] = [
  { label: "BPC-157 · 5 mg / 2 mL · 250 mcg", vialMg: 5, waterMl: 2, doseMg: 0.25 },
  { label: "Tesamorelin · 10 mg / 3 mL · 1 mg", vialMg: 10, waterMl: 3, doseMg: 1 },
  { label: "Ipamorelin · 5 mg / 2 mL · 200 mcg", vialMg: 5, waterMl: 2, doseMg: 0.2 },
  { label: "GHK-Cu · 50 mg / 5 mL · 2 mg", vialMg: 50, waterMl: 5, doseMg: 2 },
  { label: "Semax · 30 mg / 3 mL · 500 mcg", vialMg: 30, waterMl: 3, doseMg: 0.5 },
  { label: "GLP-3 (Reta) · 10 mg / 2 mL · 2 mg", vialMg: 10, waterMl: 2, doseMg: 2 },
];

function formatMg(mg: number): string {
  if (mg >= 1) return `${Number(mg.toFixed(3))} mg`;
  return `${Number((mg * 1000).toFixed(2))} mcg`;
}

export function PeptideCalculator() {
  const [syringe, setSyringe] = useState<Syringe>(SYRINGES[0]);
  const [vialMg, setVialMg] = useState<number>(10);
  const [vialOther, setVialOther] = useState<string>("");
  const [vialIsOther, setVialIsOther] = useState(false);

  const [waterMl, setWaterMl] = useState<number>(5);
  const [waterOther, setWaterOther] = useState<string>("");
  const [waterIsOther, setWaterIsOther] = useState(false);

  const [doseMg, setDoseMg] = useState<number>(0.05);
  const [doseOther, setDoseOther] = useState<string>("");
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
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-brand sm:text-5xl">
          Peptide Calculator
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg">
          Easily calculate accurate dosages by selecting your parameters with our
          Peptide Reconstitution Calculator below.
        </p>
      </div>

      {/* Quick picks */}
      <div className="mt-10">
        <div className="text-sm font-medium text-foreground/60">
          Quick start with a Viora compound
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_PICKS.map((q) => (
            <button
              key={q.label}
              onClick={() => applyQuickPick(q)}
              className="rounded-full border border-border bg-muted/30 px-4 py-2 text-sm text-foreground/80 transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-2">
        {/* LEFT: Syringe selector with SVG visuals */}
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">
            What is the total volume of your syringe?
          </h3>
          <div className="mt-5 space-y-3">
            {SYRINGES.map((s) => {
              const selected = s.mlMax === syringe.mlMax;
              return (
                <button
                  key={s.label}
                  onClick={() => setSyringe(s)}
                  className={`group flex w-full items-center gap-4 rounded-2xl border-2 px-4 py-3 text-left transition-all ${
                    selected
                      ? "border-brand bg-brand-soft shadow-sm"
                      : "border-border bg-background hover:border-brand/40 hover:bg-muted/40"
                  }`}
                >
                  <div className={`font-display text-lg font-bold ${selected ? "text-brand" : "text-foreground"}`}>
                    {s.label}
                  </div>
                  <SyringeIllustration
                    sizeFraction={s.mlMax / 1.0}
                    selected={selected}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Vial / water / dose */}
        <div className="space-y-10">
          <div className="flex items-start gap-4">
            <VialIllustration accent="brand" />
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-foreground">
                Select Peptide Vial Quantity
              </h3>
              <ChipRow
                presets={VIAL_PRESETS.map((mg) => ({ value: mg, label: `${mg} mg` }))}
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
              />
            </div>
          </div>

          <div className="flex items-start gap-4">
            <VialIllustration accent="accent" />
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-foreground">
                How much bacteriostatic water are you adding?
              </h3>
              <ChipRow
                presets={WATER_PRESETS.map((ml) => ({ value: ml, label: `${ml} mL` }))}
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
                otherSuffix="mL"
              />
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl font-bold text-foreground">
              How much of the peptide do you want in each dose?
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
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
                    className={`rounded-full px-4 py-2 text-sm transition-colors ${
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
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  doseIsOther
                    ? "bg-brand font-semibold text-brand-foreground"
                    : "border border-border bg-background text-foreground hover:border-brand hover:text-brand"
                }`}
              >
                Other
              </button>
            </div>
            {doseIsOther && (
              <div className="mt-3 flex gap-2">
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
                  className="w-36 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
                <select
                  value={doseUnit}
                  onChange={(e) => {
                    const u = e.target.value as "mcg" | "mg";
                    setDoseUnit(u);
                    const n = Number(doseOther);
                    if (!isNaN(n) && n > 0) setDoseMg(u === "mcg" ? n / 1000 : n);
                  }}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                >
                  <option value="mcg">mcg</option>
                  <option value="mg">mg</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-14 border-t border-border pt-10">
        {!result ? (
          <p className="text-center text-foreground/60">
            Enter all four values to see your reconstitution.
          </p>
        ) : (
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-foreground sm:text-xl">
              Your vial concentration is{" "}
              <strong className="font-display text-brand">
                {result.concentrationMgPerMl.toFixed(2)} mg/mL
              </strong>
              .
            </p>
            <p className="text-lg leading-relaxed text-foreground sm:text-xl">
              To achieve{" "}
              <strong className="font-display text-brand">
                {formatMg(doseMg)} ({doseMg.toFixed(3)} mg)
              </strong>
              , draw{" "}
              <strong className="font-display text-brand">
                {result.drawMl.toFixed(3)} mL
              </strong>{" "}
              <span className="text-foreground/70">
                ({result.drawUnits.toFixed(1)} units on a {syringe.subLabel} syringe)
              </span>
            </p>

            <SyringeScale
              unitsMax={syringe.unitsMax}
              drawUnits={result.drawUnits}
              overflow={result.overflow}
            />

            <p className="text-sm text-foreground/60">
              <strong className="text-foreground">Bonus tip:</strong>{" "}
              {formatMg(doseMg)} on a {result.concentrationMgPerMl.toFixed(2)} mg/mL
              vial = draw {result.drawUnits.toFixed(1)} units on a {syringe.subLabel}{" "}
              syringe.
            </p>

            {result.overflow && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                <strong>Heads up:</strong> the required draw (
                {result.drawUnits.toFixed(1)} units) exceeds your selected syringe&apos;s
                max ({syringe.unitsMax} units). Choose a larger syringe or split into
                multiple injections.
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-10 text-center text-xs leading-relaxed text-foreground/55">
        For research use only. This calculator is a research tool to help compute
        reconstitution math — not medical guidance. All compounds are intended for
        in-vitro research and laboratory use only.
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Syringe SVG illustration (length scales with mL size)         */
/* ────────────────────────────────────────────────────────────── */

function SyringeIllustration({
  sizeFraction,
  selected,
}: {
  sizeFraction: number; // 0.3, 0.5, 1.0
  selected: boolean;
}) {
  // Body length scales with capacity. Plunger + needle stay constant.
  const bodyLength = 60 + sizeFraction * 80; // 84 for 0.3, 100 for 0.5, 140 for 1.0
  const total = 200; // viewBox width
  const startX = (total - bodyLength - 50) / 2; // 50 = needle + plunger combined
  const bodyEndX = startX + bodyLength;
  const stroke = selected ? "#284C3E" : "#7a8a7e";
  const accent = selected ? "#284C3E" : "#9aa9a0";

  return (
    <svg viewBox="0 0 200 36" className="h-9 flex-1" aria-hidden="true">
      {/* Needle */}
      <line x1={startX - 14} y1="18" x2={startX} y2="18" stroke={accent} strokeWidth="1.5" />
      <rect x={startX - 4} y="15" width="6" height="6" rx="1" fill={accent} />
      {/* Body (glass cylinder) */}
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
      {/* Tick marks inside body */}
      {Array.from({ length: Math.max(3, Math.round(bodyLength / 10)) }).map((_, i, arr) => {
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
      })}
      {/* Plunger seal */}
      <rect x={bodyEndX - 6} y="9" width="6" height="18" fill={accent} opacity="0.85" />
      {/* Plunger rod */}
      <rect x={bodyEndX} y="14" width="32" height="8" fill="#e8a86a" />
      {/* Plunger flange */}
      <rect x={bodyEndX + 32} y="6" width="6" height="24" rx="1" fill="#e8a86a" />
    </svg>
  );
}

/* Tiny vial illustration — used inline next to inputs */
function VialIllustration({ accent }: { accent: "brand" | "accent" }) {
  const accentColor = accent === "brand" ? "#284C3E" : "#56B2B1";
  return (
    <svg viewBox="0 0 40 56" className="h-14 w-10 flex-none" aria-hidden="true">
      {/* Cap */}
      <rect x="12" y="2" width="16" height="6" rx="1" fill="#cbd5d0" />
      <rect x="12" y="6" width="16" height="2" fill="#9aa9a0" />
      {/* Neck */}
      <rect x="15" y="8" width="10" height="4" fill="#dde2eb" />
      {/* Body */}
      <rect
        x="8"
        y="12"
        width="24"
        height="38"
        rx="2"
        fill="#fafbfd"
        stroke="#cbd5d0"
        strokeWidth="0.8"
      />
      {/* Label */}
      <rect x="9" y="22" width="22" height="22" fill="#ffffff" />
      <rect x="9" y="22" width="22" height="4" fill={accentColor} />
      {/* Liquid hint */}
      <rect x="10" y="14" width="20" height="6" fill={accentColor} opacity="0.1" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Reusable chip row                                             */
/* ────────────────────────────────────────────────────────────── */

type Preset = { value: number; label: string };
function ChipRow({
  presets,
  value,
  isOther,
  otherText,
  onSelectPreset,
  onOther,
  otherSuffix,
}: {
  presets: Preset[];
  value: number;
  isOther: boolean;
  otherText: string;
  onSelectPreset: (v: number) => void;
  onOther: (text: string) => void;
  otherSuffix: string;
}) {
  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        {presets.map((p) => {
          const sel = !isOther && value === p.value;
          return (
            <button
              key={p.value}
              onClick={() => onSelectPreset(p.value)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
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
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
            isOther
              ? "bg-brand font-semibold text-brand-foreground"
              : "border border-border bg-background text-foreground hover:border-brand hover:text-brand"
          }`}
        >
          Other
        </button>
      </div>
      {isOther && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="any"
            value={otherText}
            onChange={(e) => onOther(e.target.value)}
            placeholder={`Enter custom ${otherSuffix}`}
            className="w-40 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
          <span className="text-sm text-foreground/60">{otherSuffix}</span>
        </div>
      )}
    </>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Result — visual syringe scale                                 */
/* ────────────────────────────────────────────────────────────── */

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
  const step = unitsMax >= 100 ? 5 : unitsMax >= 50 ? 5 : 5;
  for (let v = 0; v <= unitsMax; v += step) ticks.push(v);

  return (
    <div className="mt-2">
      <div className="relative h-12 w-full overflow-hidden rounded-lg border border-border bg-background">
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
      <div className="mt-1 grid w-full grid-flow-col text-[10px] text-foreground/60">
        {ticks.map((t) => (
          <div key={t} className="text-center" style={{ flex: 1 }}>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
