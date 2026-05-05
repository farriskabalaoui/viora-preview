import Image from "next/image";

/**
 * Clean product photo area.
 * Solid background inherited from card — no fade, no mix-blend, no gradient.
 * Just the real Viora photo with a strong drop-shadow for depth.
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
      {!isMulti ? (
        <div className="relative z-10 flex h-full w-full items-center justify-center px-4 py-3">
          <div
            className="relative h-full w-[64%]"
            style={{
              filter:
                "drop-shadow(0 16px 22px rgba(31, 38, 71, 0.18)) drop-shadow(0 4px 6px rgba(31, 38, 71, 0.08))",
            }}
          >
            <Image
              src={primary}
              alt={alt}
              fill
              sizes="280px"
              className="object-contain"
            />
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex h-full w-full items-center justify-center gap-1 px-3 py-3">
          {slugs!.map((slug, i) => {
            const count = slugs!.length;
            const heightClass = count === 2 ? "h-full" : i === 1 ? "h-full" : "h-[92%]";
            const widthClass = count === 2 ? "w-[44%]" : "w-[34%]";
            return (
              <div
                key={`${slug}-${i}`}
                className={`relative ${heightClass} ${widthClass}`}
                style={{
                  filter:
                    "drop-shadow(0 12px 16px rgba(31, 38, 71, 0.16)) drop-shadow(0 3px 4px rgba(31, 38, 71, 0.06))",
                }}
              >
                <Image
                  src={`/products/${slug}.webp`}
                  alt=""
                  fill
                  sizes="140px"
                  className="object-contain"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
