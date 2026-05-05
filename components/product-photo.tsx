import Image from "next/image";

/**
 * Clean product photo area — DP-style.
 * - Single peptide / blend: one photo centered, with soft drop-shadow.
 * - Stack: 2–3 vials side-by-side, blended onto the dotted background
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
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Soft top-to-bottom gradient (lighter at top so it blends with text section) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(244,246,248,0) 0%, rgba(244,246,248,0.6) 30%, rgba(232,236,242,0.85) 100%)",
        }}
      />

      {/* Dotted texture across the full photo area */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      {!isMulti ? (
        <div className="relative z-10 flex h-full w-full items-end justify-center pb-3 pt-2">
          {/* Vial */}
          <div
            className="relative h-[88%] w-[58%]"
            style={{ filter: "drop-shadow(0 8px 14px rgba(31, 38, 71, 0.18))" }}
          >
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
        <div className="relative z-10 flex h-full w-full items-end justify-center gap-1 pb-3 pt-2">
          {slugs!.map((slug, i) => {
            const count = slugs!.length;
            const heightClass =
              count === 2
                ? "h-[82%]"
                : i === 1
                  ? "h-[88%]"
                  : "h-[78%]";
            const widthClass = count === 2 ? "w-[42%]" : "w-[33%]";
            return (
              <div
                key={`${slug}-${i}`}
                className={`relative ${heightClass} ${widthClass}`}
                style={{
                  filter: "drop-shadow(0 6px 10px rgba(31, 38, 71, 0.16))",
                }}
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
