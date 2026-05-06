/**
 * Stylized SVG vial — full bottle always visible, DP-style background.
 * Square viewBox (400×400) so it fits cleanly in a square photo area.
 */

type Variant = "single" | "blend" | "stack";

type Props = {
  variant?: Variant;
  className?: string;
};

// Brand-band colors on the vial labels. Active GREEN palette.
// To revert to BLUE: ["#007EFF"], ["#007EFF", "#0EA5E9"], ["#007EFF", "#0EA5E9", "#1E40AF"]
const PALETTES: Record<Variant, string[]> = {
  single: ["#0E4F4D"],
  blend: ["#0E4F4D", "#147a76"],
  stack: ["#0E4F4D", "#147a76", "#063b39"],
};

// All vials sit on a baseline so they look like they share a surface.
// Total vial height = 2.64 * w. Baseline y so vials end ~y=355 (square viewBox 400×400).
const POSITIONS: Record<Variant, { x: number; w: number }[]> = {
  single: [{ x: 140, w: 120 }],
  blend: [
    { x: 90, w: 95 },
    { x: 215, w: 95 },
  ],
  stack: [
    { x: 70, w: 78 },
    { x: 161, w: 78 },
    { x: 252, w: 78 },
  ],
};

const BASELINE_Y = 360;

function VialSilhouette({
  x,
  w,
  brand,
  idx,
}: {
  x: number;
  w: number;
  brand: string;
  idx: number;
}) {
  const cap = 0.2 * w;
  const gap = 0.06 * w;
  const neck = 0.18 * w;
  const body = 2.2 * w;
  const total = cap + gap + neck + body;
  const y = BASELINE_Y - total;
  const labelTop = cap + gap + neck + 0.4 * w;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Floor shadow (under vial) */}
      <ellipse
        cx={w / 2}
        cy={total + 0.06 * w}
        rx={w * 0.55}
        ry={0.045 * w}
        fill="#000"
        opacity="0.09"
      />
      {/* Cap (top) */}
      <rect
        x={0}
        y={0}
        width={w}
        height={cap}
        rx={0.05 * w}
        fill={`url(#vial-cap-${idx})`}
      />
      <rect x={0} y={cap - 0.025 * w} width={w} height={0.04 * w} fill="#94a0b3" />
      {/* Neck */}
      <rect x={0.18 * w} y={cap + gap} width={0.64 * w} height={neck} fill="#dde2eb" />
      <rect
        x={0.18 * w}
        y={cap + gap + neck - 0.02 * w}
        width={0.64 * w}
        height={0.04 * w}
        fill="#bcc4ce"
      />
      {/* Body / glass */}
      <rect
        x={0}
        y={cap + gap + neck}
        width={w}
        height={body}
        rx={0.05 * w}
        fill={`url(#vial-glass-${idx})`}
        stroke="#cbd2db"
        strokeWidth="0.6"
      />
      {/* Liquid hint near top of body */}
      <rect
        x={0.08 * w}
        y={cap + gap + neck + 0.14 * w}
        width={0.84 * w}
        height={0.22 * w}
        fill={brand}
        opacity="0.1"
      />
      {/* Label area */}
      <rect
        x={0.04 * w}
        y={labelTop}
        width={0.92 * w}
        height={1.4 * w}
        fill="#ffffff"
      />
      {/* Brand band */}
      <rect
        x={0.04 * w}
        y={labelTop}
        width={0.92 * w}
        height={0.2 * w}
        fill={brand}
      />
      <text
        x={w / 2}
        y={labelTop + 0.14 * w}
        textAnchor="middle"
        fontSize={0.12 * w}
        fontWeight="800"
        fill="#ffffff"
        fontFamily="ui-sans-serif, system-ui"
        letterSpacing="0.06em"
      >
        VIORA
      </text>
      {/* Small text on label */}
      <text
        x={w / 2}
        y={labelTop + 0.55 * w}
        textAnchor="middle"
        fontSize={0.08 * w}
        fontWeight="700"
        fill="#3b4759"
        fontFamily="ui-sans-serif, system-ui"
      >
        RESEARCH
      </text>
      <text
        x={w / 2}
        y={labelTop + 0.74 * w}
        textAnchor="middle"
        fontSize={0.08 * w}
        fontWeight="700"
        fill="#3b4759"
        fontFamily="ui-sans-serif, system-ui"
      >
        USE ONLY
      </text>
      <text
        x={w / 2}
        y={labelTop + 1.06 * w}
        textAnchor="middle"
        fontSize={0.07 * w}
        fontWeight="600"
        fill="#7c8a9c"
        fontFamily="ui-sans-serif, system-ui"
      >
        ≥99% HPLC
      </text>
      {/* Highlight on glass */}
      <rect
        x={0.1 * w}
        y={cap + gap + neck + 0.05 * w}
        width={0.08 * w}
        height={body * 0.8}
        rx={0.04 * w}
        fill="#ffffff"
        opacity="0.45"
      />
    </g>
  );
}

export function Vial({ variant = "single", className = "" }: Props) {
  const palette = PALETTES[variant];
  const positions = POSITIONS[variant];

  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`${variant} vial illustration`}
    >
      <defs>
        <pattern id="vial-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.7" fill="#cdd5e0" />
        </pattern>
        <radialGradient id="vial-bg" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e9eef5" />
        </radialGradient>
        {positions.map((_, i) => (
          <linearGradient
            key={`cap-${i}`}
            id={`vial-cap-${i}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#e0e6ee" />
            <stop offset="100%" stopColor="#9aa5b3" />
          </linearGradient>
        ))}
        {positions.map((_, i) => (
          <linearGradient
            key={`glass-${i}`}
            id={`vial-glass-${i}`}
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#fbfcfe" />
            <stop offset="100%" stopColor="#dee5ef" />
          </linearGradient>
        ))}
      </defs>
      {/* Background gradient + dots */}
      <rect width="400" height="400" fill="url(#vial-bg)" />
      <rect width="400" height="400" fill="url(#vial-dots)" opacity="0.45" />
      {/* Subtle baseline shadow line */}
      <line
        x1="20"
        y1={BASELINE_Y + 12}
        x2="380"
        y2={BASELINE_Y + 12}
        stroke="#cdd5e0"
        strokeWidth="0.5"
        opacity="0.5"
      />
      {positions.map((p, i) => (
        <VialSilhouette
          key={i}
          x={p.x}
          w={p.w}
          brand={palette[i % palette.length]}
          idx={i}
        />
      ))}
    </svg>
  );
}

export function vialVariantFor(category: string): Variant {
  if (category === "Stack") return "stack";
  if (category === "Blend") return "blend";
  return "single";
}
