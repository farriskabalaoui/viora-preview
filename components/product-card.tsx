import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all hover:border-brand/40 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-brand-soft to-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
        />
        {product.category === "Blend" && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand backdrop-blur">
            Blend
          </span>
        )}
        {product.category === "Stack" && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand backdrop-blur">
            Stack
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-base font-semibold text-foreground">{product.name}</h3>
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            from <span className="font-medium text-foreground">${product.priceFrom}</span>
          </span>
        </div>
        {product.tags?.[0] && (
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {product.tags[0]}
          </div>
        )}
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {product.short}
        </p>
        <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand transition-transform group-hover:translate-x-0.5">
          View product
          <span aria-hidden>→</span>
        </div>
      </div>
    </Link>
  );
}
