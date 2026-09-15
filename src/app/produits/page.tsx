import { getCategories, getProducts } from "@/lib/catalog";
import { CatalogClient } from "./catalog-client";
import { getLang } from "@/lib/lang";
import { STR } from "@/data/i18n";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nos produits",
  description: "Catalogue Déco + Multi-Arts : transats, salons de jardin, balançoires, pergolas et pots en résine.",
};

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const lang = await getLang();
  const T = STR[lang];
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ category: sp.categorie, search: sp.q }),
  ]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-600">{T.prod_eyebrow}</p>
      <h1 className="font-display mt-2 text-4xl font-semibold md:text-5xl">{T.prod_title}</h1>
      <p className="mt-3 max-w-2xl text-charcoal-900/65">{T.prod_sub}</p>
      <CatalogClient
        categories={categories}
        initialProducts={products}
        initialCategory={sp.categorie ?? ""}
        initialQuery={sp.q ?? ""}
        lang={lang}
      />
    </div>
  );
}
