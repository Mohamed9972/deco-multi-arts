"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { pick } from "@/lib/lang-client";
import { STR } from "@/data/i18n";
import type { Lang } from "@/lib/format";
import type { CatalogCategory, CatalogProduct } from "@/lib/catalog";

export function CatalogClient({
  categories,
  initialProducts,
  initialCategory,
  initialQuery,
  lang,
}: {
  categories: CatalogCategory[];
  initialProducts: CatalogProduct[];
  initialCategory: string;
  initialQuery: string;
  lang: Lang;
}) {
  const T = STR[lang];
  const [cat, setCat] = useState(initialCategory);
  const [q, setQ] = useState(initialQuery);
  const [sort, setSort] = useState("featured");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const products = useMemo(() => {
    let list = [...initialProducts];
    if (cat) list = list.filter((p) => p.categorySlug === cat);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((p) =>
        `${p.name} ${p.nameAr ?? ""} ${p.shortDescription ?? ""} ${p.shortDescriptionAr ?? ""}`
          .toLowerCase()
          .includes(needle),
      );
    }
    if (onlyAvailable) list = list.filter((p) => p.available);
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        break;
      case "price-desc":
        list.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
        break;
      case "name":
        list.sort((a, b) =>
          pick(lang, a.nameAr, a.name).localeCompare(pick(lang, b.nameAr, b.name), lang === "ar" ? "ar" : "fr"),
        );
        break;
      default:
        break;
    }
    return list;
  }, [initialProducts, cat, q, sort, onlyAvailable, lang]);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 rounded-2xl border border-charcoal-900/10 bg-white p-4 md:flex-row md:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={T.search_ph}
          className="w-full rounded-full border border-charcoal-900/15 bg-ivory-50 px-4 py-2.5 text-sm outline-none focus:border-bronze-600 md:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <Link
            href="/produits"
            onClick={(e) => {
              e.preventDefault();
              setCat("");
            }}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold ${!cat ? "bg-charcoal-900 text-ivory-50" : "border border-charcoal-900/15"}`}
          >
            {T.f_all}
          </Link>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.slug === cat ? "" : c.slug)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold ${cat === c.slug ? "bg-charcoal-900 text-ivory-50" : "border border-charcoal-900/15"}`}
            >
              {pick(lang, c.nameAr, c.name)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 md:ms-auto">
          <label className="flex items-center gap-2 text-[13px] font-medium">
            <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
            {T.f_avail}
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-charcoal-900/15 bg-ivory-50 px-3 py-2 text-[13px]"
          >
            <option value="featured">{T.sort_feat}</option>
            <option value="price-asc">{T.sort_asc}</option>
            <option value="price-desc">{T.sort_desc}</option>
            <option value="name">{T.sort_name}</option>
          </select>
        </div>
      </div>

      <p className="mt-4 text-sm text-charcoal-900/60">
        {products.length} {products.length > 1 ? T.count_many : T.count_one}
      </p>

      {products.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-charcoal-900/20 p-10 text-center">
          <p className="font-display text-2xl">{T.empty_title}</p>
          <p className="mt-2 text-sm text-charcoal-900/60">{T.empty_text}</p>
          <Link
            href="/devis"
            className="mt-4 inline-block rounded-full bg-charcoal-900 px-6 py-2.5 text-sm font-semibold text-ivory-50"
          >
            {T.cta_quote}
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
