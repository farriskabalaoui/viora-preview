/**
 * Polaris north-star compass rose. Used in:
 *   - PolarisHeader (small, h-9 w-9)
 *   - COA letterhead + signature block
 *   - PDF letterhead (Python recreates this via reportlab paths)
 *   - Favicon (separate static asset; keep design in sync if regenerated)
 */

export function PolarisLogo({ className = "h-9 w-9" }: { className?: string }) {
  const NAVY = "#0a4d6f";
  const TEAL = "#56b2b1";
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      aria-label="Polaris Analytical"
    >
      {/* Outer ring */}
      <circle cx="32" cy="32" r="29" stroke={NAVY} strokeWidth="2.4" fill="white" />
      {/* Inner thin ring */}
      <circle cx="32" cy="32" r="23" stroke={NAVY} strokeOpacity="0.18" strokeWidth="0.8" fill="none" />

      {/* Major cardinal star (N/S/E/W) */}
      <path d="M32 7 L34.4 30 L49 32 L34.4 34 L32 57 L29.6 34 L15 32 L29.6 30 Z" fill={NAVY} />

      {/* Minor diagonal rays (NE/SE/SW/NW) — 4 separate triangles */}
      <path d="M46 18 L33.5 30.5 L31.5 28.5 Z" fill={NAVY} fillOpacity="0.55" />
      <path d="M46 46 L33.5 33.5 L31.5 35.5 Z" fill={NAVY} fillOpacity="0.55" />
      <path d="M18 46 L30.5 33.5 L32.5 35.5 Z" fill={NAVY} fillOpacity="0.55" />
      <path d="M18 18 L30.5 30.5 L32.5 28.5 Z" fill={NAVY} fillOpacity="0.55" />

      {/* True-north accent — teal triangle on N tip */}
      <path d="M32 7 L29.6 13.5 L34.4 13.5 Z" fill={TEAL} />

      {/* Center hub */}
      <circle cx="32" cy="32" r="3.2" fill="white" />
      <circle cx="32" cy="32" r="1.5" fill={NAVY} />
    </svg>
  );
}
