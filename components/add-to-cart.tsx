"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n-context";

type Props = {
  slug: string;
  name: string;
  priceFrom: number;
  image: string;
  outOfStock?: boolean;
};

export function AddToCart({ slug, name, priceFrom, image, outOfStock }: Props) {
  const { add, setOpen } = useCart();
  const { t } = useI18n();
  const [recent, setRecent] = useState(false);

  function handleAdd() {
    if (outOfStock) return;
    add({ slug, name, priceFrom, image }, 1);
    setRecent(true);
    setTimeout(() => setRecent(false), 1500);
    setOpen(true);
  }

  return (
    <button
      onClick={handleAdd}
      disabled={!!outOfStock}
      className={`flex-1 rounded-full px-6 py-3 text-center text-sm font-semibold transition ${
        outOfStock
          ? "cursor-not-allowed bg-muted text-muted-foreground"
          : recent
            ? "bg-emerald-600 text-white"
            : "bg-brand text-brand-foreground hover:opacity-90"
      }`}
    >
      {outOfStock
        ? t("product.out_of_stock")
        : recent
          ? `✓ ${t("cart.added")}`
          : t("product.add")}
    </button>
  );
}
