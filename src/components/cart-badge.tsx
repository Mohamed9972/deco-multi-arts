"use client";

import Link from "next/link";
import { useCart } from "./cart-store";
import { STR } from "@/data/i18n";
import type { Lang } from "@/lib/format";

export function CartBadge({ lang }: { lang: Lang }) {
  const { count } = useCart();
  const T = STR[lang];
  return (
    <Link
      href="/panier"
      className="relative rounded-full border border-charcoal-900/20 px-4 py-2 text-[13px] font-semibold text-charcoal-900 transition hover:border-charcoal-900"
    >
      {T.nav_cart}
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-bronze-600 px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
