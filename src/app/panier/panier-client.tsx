"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-store";
import { formatTND, type Lang } from "@/lib/format";
import { STR } from "@/data/i18n";

export function PanierClient({ lang }: { lang: Lang }) {
  const T = STR[lang];
  const { items, subtotal, setQty, remove, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-4xl font-semibold">{T.b_title}</h1>
        <p className="mt-3 text-charcoal-900/65">{T.b_empty}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/produits" className="rounded-full bg-charcoal-900 px-6 py-3 text-sm font-semibold text-ivory-50">
            {T.cta_products}
          </Link>
          <Link href="/devis" className="rounded-full border border-charcoal-900/25 px-6 py-3 text-sm font-semibold">
            {T.cta_quote}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">{T.b_title}</h1>
      <p className="mt-2 text-sm text-charcoal-900/60">{T.b_sub}</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.key} className="flex gap-4 rounded-2xl border border-charcoal-900/10 bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {i.image ? <img src={i.image} alt={i.name} className="h-24 w-24 rounded-xl object-cover" /> : <div className="h-24 w-24 rounded-xl bg-ivory-200" />}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/produits/${i.slug}`} className="font-semibold hover:underline">
                      {i.name}
                    </Link>
                    {Object.keys(i.options).length > 0 && (
                      <p className="mt-1 text-[13px] text-charcoal-900/60">
                        {Object.entries(i.options)
                          .map(([k, v]) => `${k} : ${v}`)
                          .join(" · ")}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-bold">{formatTND(i.unitPrice, lang)}</p>
                  </div>
                  <button onClick={() => remove(i.key)} className="text-[13px] text-red-800 underline underline-offset-4">
                    {T.b_remove}
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-charcoal-900/20">
                    <button onClick={() => setQty(i.key, i.quantity - 1)} className="px-3 py-1.5" aria-label={T.dec}>
                      −
                    </button>
                    <span className="min-w-7 text-center text-sm font-bold">{i.quantity}</span>
                    <button onClick={() => setQty(i.key, i.quantity + 1)} className="px-3 py-1.5" aria-label={T.inc}>
                      +
                    </button>
                  </div>
                  <p className="text-sm font-bold">{formatTND((i.unitPrice ?? 0) * i.quantity, lang)}</p>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clear} className="text-[13px] text-charcoal-900/55 underline underline-offset-4">
            {T.b_clear}
          </button>
        </div>
        <aside className="h-fit rounded-2xl border border-charcoal-900/10 bg-white p-6">
          <h2 className="font-display text-xl font-semibold">{T.b_sum}</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>{T.b_subtotal}</dt>
              <dd className="font-bold">{formatTND(subtotal, lang)}</dd>
            </div>
            <div className="flex justify-between text-charcoal-900/60">
              <dt>{T.b_ship}</dt>
              <dd>{T.b_ship_d}</dd>
            </div>
            <div className="flex justify-between border-t border-charcoal-900/10 pt-3 text-base">
              <dt className="font-semibold">{T.b_total}</dt>
              <dd className="font-display text-2xl font-semibold">{formatTND(subtotal, lang)}</dd>
            </div>
          </dl>
          <Link
            href="/commande"
            className="mt-5 block rounded-full bg-charcoal-900 px-6 py-3.5 text-center text-sm font-semibold text-ivory-50 hover:bg-charcoal-800"
          >
            {T.b_order}
          </Link>
          <Link
            href="/produits"
            className="mt-2 block rounded-full border border-charcoal-900/20 px-6 py-3 text-center text-sm font-semibold"
          >
            {T.b_cont}
          </Link>
          <p className="mt-4 text-xs leading-relaxed text-charcoal-900/55">{T.b_note}</p>
        </aside>
      </div>
    </div>
  );
}
