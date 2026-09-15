import Link from "next/link";
import { formatTND, productTypeLabel, type Lang } from "@/lib/format";
import { pick } from "@/lib/lang-client";
import { STR } from "@/data/i18n";
import type { CatalogProduct } from "@/lib/catalog";

export function AvailabilityBadge({ available, lang = "fr" }: { available: boolean; lang?: Lang }) {
  const T = STR[lang];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] backdrop-blur ${
        available ? "bg-lagoon-950/80 text-ivory-50" : "bg-charcoal-950/80 text-ivory-100/80"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${available ? "bg-emerald-400" : "bg-red-400"}`} aria-hidden="true" />
      {available ? T.d_avail : T.d_unavail}
    </span>
  );
}

export function ProductCard({ p, lang = "fr" }: { p: CatalogProduct; lang?: Lang }) {
  const T = STR[lang];
  const name = pick(lang, p.nameAr, p.name);
  const short = pick(lang, p.shortDescriptionAr, p.shortDescription);
  return (
    <Link
      href={`/produits/${p.slug}`}
      className="card-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-charcoal-900/10 bg-white"
    >
      <div className="img-zoom relative aspect-[4/3] overflow-hidden bg-ivory-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.coverImage ?? "/transat-marina-1.jpg"} alt={name} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute left-3 top-3 flex gap-2">
          <AvailabilityBadge available={p.available} lang={lang} />
        </div>
        {p.productType === "QUOTATION" && (
          <span className="absolute bottom-3 left-3 rounded-full bg-clay-600/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
            {productTypeLabel(p.productType, lang)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-clay-600">
          {pick(lang, p.categoryNameAr, p.categoryName) ?? productTypeLabel(p.productType, lang)}
        </p>
        <h3 className="font-display mt-1.5 text-[1.35rem] font-medium leading-snug text-charcoal-900 underline-offset-4 group-hover:underline">
          {name}
        </h3>
        {short && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-charcoal-900/60">{short}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-[15px] font-bold text-lagoon-950">
            {p.price !== null ? formatTND(p.price, lang) : productTypeLabel(p.productType, lang)}
          </p>
          <span className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-ivory-100 px-4 text-[13px] font-semibold text-lagoon-900 transition group-hover:bg-lagoon-950 group-hover:text-ivory-50">
            {T.d_view}
          </span>
        </div>
      </div>
    </Link>
  );
}
