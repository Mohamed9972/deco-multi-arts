"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart-store";
import { STR } from "@/data/i18n";
import type { Lang } from "@/lib/format";

export function AddToCart({
  productId,
  slug,
  name,
  image,
  unitPrice,
  available,
  productType,
  options,
  lang,
}: {
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  unitPrice: number | null;
  available: boolean;
  productType: string;
  options: { name: string; values: string[] }[];
  lang: Lang;
}) {
  const T = STR[lang];
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>(
    Object.fromEntries((options ?? []).map((o) => [o.name, o.values[0]])),
  );
  const [added, setAdded] = useState(false);

  const isQuotation = productType === "QUOTATION" || unitPrice === null;

  if (!available) {
    return (
      <div className="mt-6 rounded-2xl border border-red-900/20 bg-red-50 p-4 text-sm">
        <p className="font-semibold text-red-900">{T.unav_t}</p>
        <p className="mt-1 text-red-900/70">{T.unav_d}</p>
        <Link
          href="/devis"
          className="mt-3 inline-block rounded-full bg-charcoal-900 px-5 py-2.5 text-[13px] font-semibold text-ivory-50"
        >
          {T.ask_quote}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-charcoal-900/10 bg-white p-5">
      {(options ?? []).map((o) => (
        <div key={o.name} className="mb-4">
          <p className="text-[13px] font-semibold uppercase tracking-wide">{o.name}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {o.values.map((v) => (
              <button
                key={v}
                onClick={() => setSelected((s) => ({ ...s, [o.name]: v }))}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium ${
                  selected[o.name] === v ? "bg-charcoal-900 text-ivory-50" : "border border-charcoal-900/20"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      ))}

      {!isQuotation && (
        <div className="flex items-center gap-3">
          <p className="text-[13px] font-semibold uppercase tracking-wide">{T.qty}</p>
          <div className="flex items-center rounded-full border border-charcoal-900/20">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 text-lg" aria-label={T.dec}>
              −
            </button>
            <span className="min-w-8 text-center font-bold">{qty}</span>
            <button onClick={() => setQty((q) => Math.min(99, q + 1))} className="px-4 py-2 text-lg" aria-label={T.inc}>
              +
            </button>
          </div>
        </div>
      )}

      {isQuotation ? (
        <p className="mt-4 text-sm text-charcoal-900/65">{T.quo_text}</p>
      ) : (
        <button
          onClick={() => {
            add({ productId, slug, name, image, unitPrice, quantity: qty, options: selected });
            setAdded(true);
            setTimeout(() => setAdded(false), 2500);
          }}
          className="mt-4 w-full rounded-full bg-charcoal-900 px-6 py-3.5 text-sm font-semibold text-ivory-50 transition hover:bg-charcoal-800"
        >
          {added ? T.added : T.add}
        </button>
      )}

      <div className="mt-3 flex gap-2">
        {!isQuotation && (
          <Link
            href="/panier"
            className="flex-1 rounded-full border border-charcoal-900/25 px-6 py-3 text-center text-sm font-semibold"
          >
            {T.see_cart}
          </Link>
        )}
        <Link
          href="/devis"
          className="flex-1 rounded-full border border-charcoal-900/25 px-6 py-3 text-center text-sm font-semibold"
        >
          {T.ask_quote}
        </Link>
      </div>
    </div>
  );
}
