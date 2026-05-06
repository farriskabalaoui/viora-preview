"use client";

import { useMemo, useState } from "react";

type Syringe = { mlMax: number; label: string; unitsMax: number };

const SYRINGES: Syringe[] = [
  { mlMax: 0.3, label: "0.3 mL · U30", unitsMax: 30 },
  { mlMax: 0.5, label: "0.5 mL · U50", unitsMax: 50 },
  { mlMax: 1.0, label: "1 mL · U100", unitsMax: 100 },
];

const VIAL_PRESETS = [2, 3, 5, 10, 15];
const WATER_PRESETS = [1, 2, 3, 5];
// Dose stored in mg internally; label shows the natural unit
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
  href?: string;
};

const QUICK_PICKS: QuickPick[] = [
  { label: "BPC-157 · 5 mg / 2 mL · 250 mcg dose", vialMg: 5, waterMl: 2, doseMg: 0.25, href: "/products/bpc-157" },
  { label: "Tesamorelin · 10 mg / 3 mL · 1 mg dose", vialMg: 10, waterMl: 3, doseMg: 1, href: "/products/tesamorelin" },
  { label: "Ipamorelin · 5 mg / 2 mL · 200 mcg dose", vialMg: 5, waterMl: 2, doseMg: 0.2, href: "/products/ipamorelin" },
  { label: "GHK-Cu · 50 mg / 5 mL · 2 mg dose", vialMg: 50, waterMl: 5, doseMg: 2, href: "/products/ghk-cu" },
  { label: "Semax · 30 mg / 3 mL · 500 mcg dose", vialMg: 30, waterMl: 3, doseMg: 0.5, href: "/products/semax" },
  { label: "GLP-3 (Reta) · 10 mg / 2 mL · 2 mg dose", vialMg: 10, waterMl: 2, doseMg: 2, href: "/products/glp-3-reta" },
];

function formatMg(mg: number): string {
  if (mg >= 1) return `${Number(mg.toFixed(3))} mg`;
  const mcg = mg * 1000;
  return `${Number(mcg.toFixed(2))} mcg`;
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
    const drawUnits = drawMl * 100; // U-100 insulin syringe convention
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
    <div className="rounded-3xl border border-border bg-background p-6 sm:p-10">
      <div className="text-center">
        <div className="text-xs font-medium uppercase tracking-wider text-brand">
          Lab Tool
        </div>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Peptide Reconstitution Calculator
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Calculate the exact volume to draw based on your vial, your bacteriostatic
          water, and your target dose. Results update instantly.
        </p>
      </div>

      {/* Quick picks */}
      <div className="mt-8">
        <div className="text-xs font-medium uppercase tracking-wider text-foreground/70">
          Quick start
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_PICKS.map((q) => (
            <button
              key={q.label}
              onClick={() => applyQuickPick(q)}
              className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Left: syringe selection */}
        <div>
          <Label>1. What's your syringe size?</Label>
          <div className="mt-3 space-y-2">
            {SYRINGES.map((s) => (
              <button
                key={s.label}
                onClick={() => setSyringe(s)}
                className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors ${
                  s.mlMax === syringe.mlMax
                    ? "border-brand bg-brand text-brand-foreground shadow-md"
                    : "border-border bg-muted/30 text-foreground hover:border-brand/40 hover:bg-muted/60"
                }`}
              >
                <span className="font-semibold">{s.label}</span>
                <span
                  className={`text-xs ${s.mlMax === syringe.mlMax ? "text-brand-foreground/70" : "text-muted-foreground"}`}
                >
                  Max {s.unitsMax} units
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: vial + water + dose */}
        <div className="space-y-8">
          <ChipPicker
            label="2. Peptide vial quantity"
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

          <ChipPicker
            label="3. Bacteriostatic water"
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

          <div>
            <Label>4. Dose per injection</Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {DOSE_PRESETS.map((d) => (
                <button
                  key={d.label}
                  onClick={() => {
                    setDoseMg(d.mg);
                    setDoseIsOther(false);
                    setDoseOther("");
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    !doseIsOther && Math.abs(doseMg - d.mg) < 0.0001
                      ? "bg-brand text-brand-foreground"
                      : "border border-border bg-muted/40 text-foreground hover:border-brand hover:text-brand"
                  }`}
                >
                  {d.label}
                </button>
              ))}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setDoseIsOther(true);
                    if (doseOther) {
                      const n = Number(doseOther);
                      if (!isNaN(n) && n > 0)
                        setDoseMg(doseUnit === "mcg" ? n / 1000 : n);
                    }
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    doseIsOther
                      ? "bg-brand text-brand-foreground"
                      : "border border-border bg-muted/40 text-foreground hover:border-brand hover:text-brand"
                  }`}
                >
                  Other
                </button>
              </div>
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
                  placeholder="e.g. 750"
                  className="w-32 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
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
      <div className="mt-10 rounded-3xl border border-brand/30 bg-brand-soft p-6 sm:p-8">
        {!result ? (
          <div className="text-center text-muted-foreground">
            Enter all four values to see your reconstitution.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Stat label="Vial concentration" value={`${result.concentrationMgPerMl.toFixed(2)} mg/mL`} />
              <Stat label="Volume to draw" value={`${result.drawMl.toFixed(3)} mL`} />
              <Stat
                label={`Units on ${syringe.label.split("·")[1].trim()}`}
                value={`${result.drawUnits.toFixed(1)} units`}
                warn={result.overflow}
              />
            </div>

            <p className="text-base leading-relaxed text-foreground">
              <strong className="text-brand">Reconstitution recipe:</strong> Dissolve{" "}
              <strong>{vialMg} mg</strong> of peptide in <strong>{waterMl} mL</strong>{" "}
              of bacteriostatic water → vial concentration is{" "}
              <strong>{result.concentrationMgPerMl.toFixed(2)} mg/mL</strong>. To get a{" "}
              <strong>{formatMg(doseMg)}</strong> dose, draw{" "}
              <strong>{result.drawMl.toFixed(3)} mL</strong>{" "}
              <span className="text-muted-foreground">
                ({result.drawUnits.toFixed(1)} units on a {syringe.label.split("·")[1].trim()} insulin syringe).
              </span>
            </p>

            <SyringeScale unitsMax={syringe.unitsMax} drawUnits={result.drawUnits} overflow={result.overflow} />

            {result.overflow && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                <strong>Heads up:</strong> The required draw ({result.drawUnits.toFixed(1)}{" "}
                units) exceeds your selected syringe's max ({syringe.unitsMax} units).
                Choose a larger syringe or split into multiple injections — never
                overfill.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
        <strong className="text-foreground">For research use only.</strong> This
        calculator is a research tool to help compute reconstitution math. It is
        not medical guidance. All compounds are intended for in-vitro research and
        laboratory use only — not for human consumption, diagnostic, or therapeutic
        use.
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-foreground">
      {children}
    </label>
  );
}

type Preset = { value: number; label: string };
function ChipPicker({
  label,
  presets,
  value,
  isOther,
  otherText,
  onSelectPreset,
  onOther,
  otherSuffix,
}: {
  label: string;
  presets: Preset[];
  value: number;
  isOther: boolean;
  otherText: string;
  onSelectPreset: (v: number) => void;
  onOther: (text: string) => void;
  otherSuffix: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.value}
            onClick={() => onSelectPreset(p.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              !isOther && value === p.value
                ? "bg-brand text-brand-foreground"
                : "border border-border bg-muted/40 text-foreground hover:border-brand hover:text-brand"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => onOther(otherText)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            isOther
              ? "bg-brand text-brand-foreground"
              : "border border-border bg-muted/40 text-foreground hover:border-brand hover:text-brand"
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
          <span className="text-sm text-muted-foreground">{otherSuffix}</span>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wider text-brand">
        {label}
      </div>
      <div
        className={`mt-1 text-2xl font-bold tracking-tight ${warn ? "text-amber-700" : "text-foreground"}`}
      >
        {value}
      </div>
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
  const step = unitsMax >= 100 ? 10 : unitsMax >= 50 ? 5 : 5;
  for (let v = 0; v <= unitsMax; v += step) ticks.push(v);

  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="mb-2 flex items-baseline justify-between text-xs">
        <span className="font-mono uppercase tracking-wider text-muted-foreground">
          Insulin syringe scale
        </span>
        <span className="font-mono uppercase tracking-wider text-muted-foreground">
          Max {unitsMax} units
        </span>
      </div>
      <div className="relative h-12 w-full overflow-hidden rounded-xl border border-border bg-muted/40">
        <div
          className={`absolute inset-y-0 left-0 ${overflow ? "bg-amber-500" : "bg-brand"}`}
          style={{ width: `${fillPct}%` }}
        />
        {/* tick lines */}
        {ticks.map((t) => (
          <div
            key={t}
            className="absolute top-0 bottom-0 w-px bg-foreground/15"
            style={{ left: `${(t / unitsMax) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-1 grid w-full grid-flow-col text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        {ticks.map((t) => (
          <div key={t} className="text-center" style={{ flex: 1 }}>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
