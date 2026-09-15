import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/catalog";
import { formatTND, productTypeLabel, type Lang } from "@/lib/format";
import { getLang, pick } from "@/lib/lang";
import { STR } from "@/data/i18n";
import { PHONE_DISPLAY, PHONE_WA } from "@/data/fallback";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { AddToCart } from "./add-to-cart";
import { ProductGallery } from "./product-gallery";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Produit introuvable" };
  return { title: p.name, description: p.shortDescription ?? undefined };
}

const COLOR_HEX: Record<string, string> = {
  blanc: "#faf7f1",
  sable: "#e6dcc8",
  beige: "#e6dcc8",
  gris: "#9aa0a6",
  "gris clair": "#d7dce1",
  anthracite: "#3a3a38",
  noir: "#1a1917",
  bleu: "#2f6db3",
  "bleu clair": "#bcd7f5",
  vert: "#12705f",
  terracotta: "#c2682a",
  marron: "#6f542f",
  doré: "#d4a94e",
};

function colorHex(name: string): string {
  return COLOR_HEX[name.trim().toLowerCase()] ?? "#9a7b4f";
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang: Lang = await getLang();
  const T = STR[lang];
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const name = pick(lang, product.nameAr, product.name);
  const short = pick(lang, product.shortDescriptionAr, product.shortDescription);
  const desc = pick(lang, product.descriptionAr, product.description);
  const categoryName = pick(lang, product.categoryNameAr, product.categoryName);

  const related = (await getProducts({ category: product.categorySlug ?? undefined }))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  const waText = encodeURIComponent(
    lang === "ar"
      ? `السلام عليكم، أريد الاستفسار عن "${name}" (${product.slug}).`
      : `Bonjour Déco + Multi-Arts, je m'intéresse à "${name}" (${product.slug}).`,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="text-[13px] text-charcoal-900/55">
        <Link href="/" className="hover:underline">{T.nav_home}</Link> {" / "}
        <Link href="/produits" className="hover:underline">{T.crumb_products}</Link>
        {categoryName && (
          <>
            {" / "}
            <Link href={`/produits?categorie=${product.categorySlug}`} className="hover:underline">
              {categoryName}
            </Link>
          </>
        )}{" / "}
        <span className="text-charcoal-900">{name}</span>
      </nav>

      {/* ——— Haut de page : galerie + achat ——— */}
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="self-start lg:sticky lg:top-24">
          <ProductGallery
            key={product.slug}
            images={product.images}
            name={name}
            available={product.available}
            productType={product.productType}
            lang={lang}
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px]">
            {categoryName && (
              <Link
                href={`/produits?categorie=${product.categorySlug}`}
                className="font-semibold uppercase tracking-[0.14em] text-clay-600 link-sweep"
              >
                {categoryName}
              </Link>
            )}
            <span className="text-charcoal-900/40">·</span>
            <span className="text-charcoal-900/55">{T.d_ref} : {product.slug}</span>
          </div>

          <h1 className="font-display mt-2 text-4xl font-semibold leading-tight text-balance md:text-5xl">{name}</h1>
          {short && <p className="mt-3 text-lg leading-relaxed text-charcoal-900/70">{short}</p>}

          {/* Prix */}
          <div className="mt-6 rounded-3xl bg-lagoon-950 p-6 text-ivory-50">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory-50/60">
                  {productTypeLabel(product.productType, lang)}
                </p>
                <p className="font-display mt-1 text-4xl font-semibold">
                  {product.price !== null ? formatTND(product.price, lang) : productTypeLabel(product.productType, lang)}
                </p>
              </div>
              <a
                href={`https://wa.me/${PHONE_WA}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-clay-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-clay-400"
              >
                {T.d_whatsapp_order}
              </a>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ivory-50/65">
              {product.price !== null ? T.d_price_note_in : T.d_price_note_out}
            </p>
          </div>

          <AddToCart
            productId={product.id}
            slug={product.slug}
            name={name}
            image={product.coverImage}
            unitPrice={product.price}
            available={product.available}
            productType={product.productType}
            options={product.options ?? []}
            lang={lang}
          />

          {product.productType === "QUOTATION" && (
            <Link
              href={`/devis?produit=${encodeURIComponent(product.name)}`}
              className="mt-3 block rounded-full border border-charcoal-900/25 px-6 py-3 text-center text-sm font-semibold hover:border-charcoal-900"
            >
              {T.d_quote_cta}
            </Link>
          )}

          {/* Réassurance */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { t: T.d_trust_warranty_t, d: T.d_trust_warranty_d },
              { t: T.d_trust_delivery_t, d: T.d_trust_delivery_d },
              { t: T.d_trust_confirm_t, d: T.d_trust_confirm_d },
            ].map((b) => (
              <div key={b.t} className="rounded-2xl border border-charcoal-900/10 bg-white p-4">
                <p className="flex items-center gap-1.5 text-[13px] font-bold text-lagoon-900">
                  <span className="text-clay-500" aria-hidden="true">✓</span> {b.t}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-charcoal-900/60">{b.d}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[13px] text-charcoal-900/55">
            {T.c_phone_t} : <a href={`tel:+${PHONE_WA}`} className="font-semibold text-charcoal-900 underline underline-offset-4">{PHONE_DISPLAY}</a>
          </p>
        </div>
      </div>

      {/* ——— Détails ——— */}
      <section className="mt-16">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-clay-600">{T.d_highlights}</p>
          <h2 className="font-display mt-1 text-3xl font-semibold">{T.d_details_title}</h2>
        </Reveal>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          {/* Description + specs */}
          <Reveal className="rounded-3xl border border-charcoal-900/10 bg-white p-6 md:p-8">
            {desc && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">{T.d_desc}</h3>
                <p className="mt-3 leading-relaxed text-charcoal-900/75">{desc}</p>
              </div>
            )}
            {product.specifications.length > 0 && (
              <div className={desc ? "mt-8" : ""}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">{T.d_specs}</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {product.specifications.map((s) => (
                    <li
                      key={s}
                      className="flex items-start gap-2.5 rounded-2xl bg-ivory-100 px-4 py-3 text-sm text-charcoal-900/80"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lagoon-800 text-[11px] font-bold text-ivory-50" aria-hidden="true">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>

          {/* Fiche pratique */}
          <div className="flex flex-col gap-6">
            <Reveal delay={80} className="rounded-3xl border border-charcoal-900/10 bg-white p-6">
              {product.material && (
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-charcoal-900/50">{T.d_material}</p>
                  <p className="mt-1.5 font-medium text-charcoal-900">{product.material}</p>
                </div>
              )}
              {product.colors.length > 0 && (
                <div className={product.material ? "mt-5" : ""}>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-charcoal-900/50">{T.d_colors}</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-2 rounded-full border border-charcoal-900/12 bg-ivory-50 py-1.5 pl-1.5 pr-3.5 text-[13px] font-medium"
                      >
                        <span
                          className="h-6 w-6 rounded-full border border-charcoal-900/15"
                          style={{ backgroundColor: colorHex(c) }}
                          aria-hidden="true"
                        />
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {product.dimensions && (
                <div className="mt-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-charcoal-900/50">{T.d_dims}</p>
                  <dl className="mt-2 overflow-hidden rounded-2xl border border-charcoal-900/10">
                    {Object.entries(product.dimensions).map(([k, v], i) => (
                      <div
                        key={k}
                        className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm ${i % 2 === 0 ? "bg-ivory-100" : "bg-white"}`}
                      >
                        <dt className="text-charcoal-900/65">{k}</dt>
                        <dd className="font-bold text-charcoal-900">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </Reveal>

            <Reveal delay={140} className="rounded-3xl bg-lagoon-50 p-6 ring-1 ring-lagoon-800/10">
              <h3 className="font-display text-xl font-semibold text-lagoon-950">{T.d_care_t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-lagoon-950/70">{T.d_care_d}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section className="mt-14">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold">{T.d_faq_t}</h2>
        </Reveal>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {[
            { q: T.d_faq_q1, a: T.d_faq_a1 },
            { q: T.d_faq_q2, a: T.d_faq_a2 },
            { q: T.d_faq_q3, a: T.d_faq_a3 },
          ].map((f, i) => (
            <Reveal key={f.q} delay={i * 70}>
              <details className="group h-full rounded-3xl border border-charcoal-900/10 bg-white p-6 open:shadow-[0_20px_45px_-25px_rgba(8,29,25,0.4)]">
                <summary className="cursor-pointer list-none font-semibold leading-snug text-charcoal-900 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-3">
                    {f.q}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ivory-100 text-lg transition group-open:rotate-45 group-open:bg-lagoon-950 group-open:text-ivory-50" aria-hidden="true">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-900/70">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— Associés ——— */}
      {related.length > 0 && (
        <section className="mt-16">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">{T.d_related}</h2>
            <p className="mt-1 text-sm text-charcoal-900/60">{T.d_related_sub}</p>
          </Reveal>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <ProductCard p={p} lang={lang} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
