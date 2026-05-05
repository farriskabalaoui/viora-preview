import Image from "next/image";

/**
 * Clean product photo area — DP-style.
 * - Single peptide: one vial centered.
 * - Stack/Blend: 2–3 vials side-by-side, blended onto the dotted background
 *   via mix-blend-mode so the photos' white backgrounds disappear and the
 *   composition looks unified.
 */
export function ProductPhoto({
  primary,
  alt,
  peptides,
  className = "",
}: {
  primary: string;
  alt: string;
  peptides?: string[];
  className?: string;
}) {
  const isMulti = !!peptides && peptides.length >= 2;
  const slugs = isMulti ? peptides! : null;

  return (
    <div className={`relative w-full overflow-hidden bg-muted/80 ${className}`}>
      {/* Dotted background */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      {/* Subtle ground line — gives vials a baseline */}
      <div
        aria-hidden
        className="absolute inset-x-6 bottom-[14%] h-px bg-foreground/10"
      />

      {!isMulti ? (
        <div className="relative z-10 flex h-full w-full items-end justify-center pb-3 pt-3">
          <div className="relative h-[88%] w-[60%]">
            <Image
              src={primary}
              alt={alt}
              fill
              sizes="220px"
              className="object-contain mix-blend-multiply"
            />
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex h-full w-full items-end justify-center gap-1 pb-3 pt-3">
          {slugs!.map((slug, i) => {
            const count = slugs!.length;
            // Slight stagger so middle vial appears taller (DP-like depth)
            const heightClass =
              count === 2
                ? "h-[82%]"
                : i === 1
                  ? "h-[88%]"
                  : "h-[78%]";
            const widthClass =
              count === 2 ? "w-[42%]" : "w-[33%]";
            return (
              <div
                key={`${slug}-${i}`}
                className={`relative ${heightClass} ${widthClass}`}
              >
                <Image
                  src={`/products/${slug}.webp`}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-contain mix-blend-multiply"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
