import Link from "next/link";
import Image from "next/image";
import { getCategories, getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { formatTND, type Lang } from "@/lib/format";
import { getLang, pick } from "@/lib/lang";
import { STR } from "@/data/i18n";
import { GALLERY, HERO_IMAGE, PHONE_WA } from "@/data/fallback";

export const dynamic = "force-dynamic";

/* ——— Inline SVG icon set (no emoji, Lucide-style strokes) ——— */
const Arrow = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);
const Check = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const Shield = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const Sun = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);
const WaIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.04 2C6.56 2 2.1 6.45 2.1 11.93c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.48 0 9.93-4.45 9.93-9.93 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2" />
  </svg>
);

export default async function HomePage() {
  const lang: Lang = await getLang();
  const T = STR[lang];
  const ar = lang === "ar";
  const [categories, products] = await Promise.all([getCategories(), getProducts({ featured: true })]);
  const featuredCats = categories.filter((c) => c.image).slice(0, 6);
  const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PHONE_WA;
  const waHref = `https://wa.me/${waNum}?text=${encodeURIComponent(
    ar ? "مرحبا ديكو + مالتي آرتس، أريد استفسارا." : "Bonjour Déco + Multi-Arts, je souhaite un renseignement.",
  )}`;

  const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7", "lg:col-span-6", "lg:col-span-6"];

  const strengths = ar
    ? [
        ["01", "قولبة دورانية مضادة للأشعة", "بلاستيك مضاد للأشعة فوق البنفسجية يتحمل الشمس والكلور والرمل والاستعمال المكثف."],
        ["02", "هياكل مجلفنة ضد الصدأ", "معدن مجلفن وقماش مضاد للماء لصالونات الحدائق والبرغولات."],
        ["03", "ضمان 3 سنوات حقيقي", "ترانزاتنا تبقى في الخارج طوال السنة: الشمس والحرارة والمطر مشمولة."],
        ["04", "مقاسات وألوان حسب الطلب", "من الفيلا الخاصة إلى تجهيز فندق كامل بالكميات التي تريدها."],
        ["05", "طلب بدون دفع مسبق", "سلة online وتتبع مباشر، والدفع عند التأكيد مع الورشة."],
        ["06", "توصيل لكامل تونس", "من تونس العاصمة إلى جربة، مع اتصال مباشر على الرقم المعروض."],
      ]
    : [
        ["01", "Rotomoulage anti-UV", "Plastique anti-UV qui encaisse soleil, chlore, sable et usages intensifs."],
        ["02", "Structures galvanisées", "Métal galvanisé et tissus waterproof pour salons, pergolas et bords de piscine."],
        ["03", "Garantie 3 ans incluse", "Nos transats restent dehors toute l'année : soleil, chaleur et pluie couverts."],
        ["04", "Dimensions & coloris à la carte", "De la villa privée à l'équipement complet d'un hôtel."],
        ["05", "Commande sans paiement en ligne", "Panier en ligne, suivi direct, règlement à la confirmation avec l'atelier."],
        ["06", "Livraison dans toute la Tunisie", "De Tunis à Djerba, avec un interlocuteur direct au téléphone."],
      ];

  const projects = ar
    ? [
        { tag: "فيلا · الحمامات", title: "ترانزات مارينا حول المسبح", img: "/transat-marina-2.jpg" },
        { tag: "دار ضيافة · سيدي بوسعيد", title: "برغولا وصالون حسب المقاس", img: "/pergola-1.jpg" },
        { tag: "سطح · تونس العاصمة", title: "أحواض ريزين وتنسيق نباتي", img: "/pots-resine-6.jpg" },
      ]
    : [
        { tag: "Villa · Hammamet", title: "Transats Marina autour du bassin", img: "/transat-marina-2.jpg" },
        { tag: "Maison d'hôtes · Sidi Bou Saïd", title: "Pergola + salon aux mesures", img: "/pergola-1.jpg" },
        { tag: "Rooftop · Tunis", title: "Pots résine & composition végétale", img: "/pots-resine-6.jpg" },
      ];

  const faqs = ar
    ? [
        ["هل التوصيل يشمل مدينتي؟", "نعم، نوصل لكامل تراب الجمهورية. أكد العنوان عبر الهاتف أو واتساب عند تأكيد الطلب وسنحدد لك الأجل والكلفة."],
        ["ماذا تغطي ضمان الـ3 سنوات؟", "الشمس والحرارة والمطر والاستعمال العادي في الخارج. الترانزات مصممة لتبقى خارج البيت طوال السنة."],
        ["هل يمكن اختيار اللون والمقاس؟", "نعم. الترانزات متوفرة بعدة ألوان، والبرغولات والأثاث المهني يصنع حسب مخططاتك وصورك ومقاساتك."],
        ["كيف أدفع؟", "لا يوجد دفع online. تسجل طلبك على الموقع، تتصل بك الورشة للتأكيد، ثم يتم الدفع عند الاستلام أو حسب الاتفاق."],
      ]
    : [
        ["Livrez-vous dans ma ville ?", "Oui, nous livrons sur tout le territoire tunisien. Confirmez l'adresse par téléphone ou WhatsApp à la validation et nous fixons délai et coût."],
        ["Que couvre la garantie 3 ans ?", "Soleil, chaleur, pluie et usage extérieur normal. Nos transats sont conçus pour rester dehors toute l'année."],
        ["Puis-je choisir couleur et dimensions ?", "Oui. Les transats existent en plusieurs coloris, et pergolas comme mobilier pro sont fabriqués sur vos plans, photos et mesures."],
        ["Comment se passe le paiement ?", "Aucun paiement en ligne. Vous enregistrez votre demande, l'atelier vous confirme, puis règlement à la livraison ou selon accord."],
      ];

  return (
    <div>
      {/* ══════════ HERO — villa + piscine, cinématique ══════════ */}
      <section aria-label={ar ? "عرض رئيسي" : "Présentation"} className="grain relative flex min-h-[100dvh] items-end overflow-hidden bg-lagoon-950 text-ivory-50">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="animate-hero-drift object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-lagoon-950 via-lagoon-950/45 to-lagoon-950/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-lagoon-950/70 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 pb-16 pt-32 sm:px-6 md:pb-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="animate-fade-up">
            <p className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory-100 backdrop-blur">
              <span className="animate-pulse-dot h-2 w-2 rounded-full bg-lagoon-200" aria-hidden="true" />
              {ar ? "ورشة تونسية — فيلات · فنادق · مسابح" : "Atelier tunisien — Villas · Hôtels · Piscines"}
            </p>
            <h1 className="text-balance mt-6 font-display text-[clamp(2.9rem,7vw,5.6rem)] font-medium leading-[1.01] tracking-tight">
              {ar ? (
                <>حافة المسبح التي تحلم بها <span className="inline-flex h-[0.72em] w-[1.6em] overflow-hidden rounded-full align-[-0.08em]"><img src="/transat-marina-1.jpg" alt="" className="h-full w-full object-cover" /></span> فيلتك.</>
              ) : (
                <>Le bord de <span className="inline-flex h-[0.72em] w-[1.6em] overflow-hidden rounded-full align-[-0.08em]"><img src="/transat-marina-1.jpg" alt="Transat Marina au bord d'une piscine" className="h-full w-full object-cover" /></span> piscine dont votre villa rêve.</>
              )}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ivory-100/85 md:text-lg">
              {ar
                ? "ترانزات مضادة للأشعة، صالونات مجلفنة، برغولات حسب الطلب — مصنوعة في تونس للشمس والكلور والرمل. بضمان 3 سنوات."
                : "Transats anti-UV, salons galvanisés, pergolas sur mesure — fabriqués en Tunisie pour le soleil, le chlore et le sable. Garantis 3 ans."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/produits"
                className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-clay-600 px-8 py-4 text-[15px] font-semibold text-white shadow-[0_18px_40px_-16px_rgba(154,78,30,0.8)] transition hover:-translate-y-0.5 hover:bg-clay-500"
              >
                {ar ? "تصفح الكتالوج" : "Voir le catalogue"}
                <Arrow />
              </Link>
              <Link
                href="/devis"
                className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-white/35 bg-white/5 px-8 py-4 text-[15px] font-semibold text-white backdrop-blur transition hover:border-white/70 hover:bg-white/15"
              >
                {ar ? "عرض سعر خلال 24 ساعة" : "Devis 24h — sans engagement"}
              </Link>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-[13.5px] font-medium text-ivory-100/75">
              {[
                <Shield key="s" className="h-4 w-4 text-sand-300" />,
                <Sun key="u" className="h-4 w-4 text-sand-300" />,
                <Check key="c" className="h-4 w-4 text-sand-300" />,
              ].map((icon, i) => (
                <li key={i} className="flex items-center gap-2">
                  {icon}
                  {[ar ? "ضمان 3 سنوات" : "Garantie 3 ans", ar ? "يبقى في الخارج 365 يوما" : "Reste dehors 365 j/an", ar ? "بدون دفع مسبق online" : "Sans paiement en ligne"][i]}
                </li>
              ))}
            </ul>
          </div>

          {/* Carte produit flottante — preuve immédiate */}
          <div className="animate-fade-up hidden lg:block" style={{ animationDelay: "180ms" }}>
            <div className="animate-float-soft glass-dark rounded-3xl p-6 shadow-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sand-300">{ar ? "الأكثر طلبا" : "Le plus demandé"}</p>
              <div className="img-zoom mt-3 overflow-hidden rounded-2xl">
                <img src="/transat-marina-1.jpg" alt={ar ? "ترانزات مارينا" : "Transat Marina"} className="aspect-[16/10] w-full object-cover" loading="eager" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-2xl font-medium">{ar ? "ترانزات مارينا" : "Transat Marina"}</p>
                  <p className="mt-1 text-sm text-ivory-100/70">{ar ? "مضاد للأشعة · داخلي وخارجي" : "Anti-UV · intérieur & extérieur"}</p>
                </div>
                <p className="whitespace-nowrap rounded-full bg-ivory-50 px-3.5 py-1.5 text-sm font-bold text-lagoon-950">{formatTND(850, lang)}</p>
              </div>
              <div className="mt-3 flex items-center gap-1.5" aria-label={ar ? "عدة ألوان متوفرة" : "Plusieurs coloris"}>
                {["#FAFAF7", "#D9CAAE", "#8A8F8C", "#2A5F7F", "#C2682A"].map((c) => (
                  <span key={c} className="h-5 w-5 rounded-full border border-white/40" style={{ background: c }} />
                ))}
                <span className="ms-1 text-xs text-ivory-100/65">{ar ? "5 ألوان" : "5 coloris"}</span>
              </div>
              <Link href="/produits/transat-marina" className="mt-5 flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-ivory-50 text-sm font-semibold text-lagoon-950 transition hover:bg-white">
                {ar ? "شاهد المنتج" : "Voir le produit"} <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ MARQUEE — univers clients ══════════ */}
      <div className="overflow-hidden border-y border-white/10 bg-lagoon-950 py-4 text-ivory-100" aria-label={ar ? "مجالات التدخل" : "Nos univers"}>
        <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap pe-8">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-8" aria-hidden={dup === 1}>
              {(ar ? ["فلل", "فنادق", "دور ضيافة", "أسطح", "شواطئ", "مطاعم", "+216 93 343 187"] : ["Villas", "Hôtels", "Maisons d'hôtes", "Rooftops", "Plages", "Restaurants", "+216 93 343 187"]).map((w) => (
                <span key={`${dup}-${w}`} className="flex items-center gap-8 text-[13px] font-semibold uppercase tracking-[0.28em]">
                  {w} <span className="h-1.5 w-1.5 rounded-full bg-clay-400" aria-hidden="true" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ UNIVERS — bento asymétrique ══════════ */}
      <section aria-labelledby="univers" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay-600">{ar ? "عوالمنا" : "Nos univers"}</p>
              <h2 id="univers" className="text-balance mt-3 font-display text-3xl font-medium tracking-tight md:text-5xl">
                {ar ? "كل ركن خارجي له قطعته." : "Chaque extérieur a sa pièce."}
              </h2>
            </div>
            <Link href="/produits" className="link-sweep hidden items-center gap-2 text-sm font-semibold text-lagoon-800 md:inline-flex">
              {ar ? "كل الكتالوج" : "Tout le catalogue"} <Arrow />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-12">
          {featuredCats.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 90} className={`${spans[i % spans.length]}`}>
              <Link
                href={`/produits?categorie=${c.slug}`}
                className="img-zoom group relative block overflow-hidden rounded-3xl bg-lagoon-950"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image ?? ""}
                  alt={pick(lang, c.nameAr, c.name)}
                  loading="lazy"
                  className={`w-full object-cover opacity-90 ${i === 0 ? "aspect-[16/10] lg:aspect-auto lg:h-[460px]" : "aspect-[16/10] lg:h-[300px]"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-lagoon-950/90 via-lagoon-950/15 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                  <div>
                    <p className="font-display text-2xl font-medium text-white md:text-[1.7rem]">{pick(lang, c.nameAr, c.name)}</p>
                    {(pick(lang, c.descriptionAr, c.description) ?? "") !== "" && (
                      <p className="mt-1 line-clamp-1 max-w-md text-sm text-white/70">{pick(lang, c.descriptionAr, c.description)}</p>
                    )}
                  </div>
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ivory-50 text-lagoon-950 transition group-hover:bg-clay-500 group-hover:text-white">
                    <Arrow className={ar ? "h-5 w-5 -scale-x-100" : "h-5 w-5"} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════ VEDETTES ══════════ */}
      <section aria-labelledby="vedettes" className="border-y border-charcoal-900/10 bg-ivory-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay-600">{ar ? "مختارات الورشة" : "Sélection atelier"}</p>
                <h2 id="vedettes" className="text-balance mt-3 font-display text-3xl font-medium tracking-tight md:text-5xl">
                  {ar ? "القطع التي تجهز المسابح." : "Les pièces qui équipent les piscines."}
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-charcoal-900/60">
                {ar ? "بدون دفع online — تؤكد الورشة كل طلب قبل الدفع." : "Sans paiement en ligne — l'atelier confirme chaque commande avant règlement."}
              </p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 90}>
                <ProductCard p={p} lang={lang} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <Link href="/produits" className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-lagoon-950 px-8 py-4 text-[15px] font-semibold text-ivory-50 transition hover:-translate-y-0.5 hover:bg-lagoon-800">
              {ar ? "شاهد كل المنتجات" : "Voir tous les produits"} <Arrow />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ══════════ SAVOIR-FAIRE — zig-zag éditorial ══════════ */}
      <section aria-labelledby="savoir" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay-600">{ar ? "مسابح · حدائق · شرفات" : "Piscines · Jardins · Terrasses"}</p>
            <h2 id="savoir" className="text-balance mt-3 font-display text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl">
              {ar ? "مصمم ليعيش في الخارج، لا ليختبئ منه." : "Dessiné pour vivre dehors, pas pour s'y cacher."}
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-charcoal-900/65">
              {ar ? "الشمس والكلور والرمل والاستعمال المكثف: مقاسات كبيرة وخامات مقاومة وصيانة بسيطة بنفث الماء." : "Soleil, chlore, sable, usages intensifs : dimensions généreuses, matériaux résistants, entretien simple au jet d'eau."}
            </p>
            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {(ar ? ["فلل ومسابح", "فنادق ودور ضيافة", "شرفات وأسطح", "شواطئ وإقامات"] : ["Villas & piscines", "Hôtels & maisons d'hôtes", "Terrasses & rooftops", "Plages & résidences"]).map((t) => (
                <li key={t} className="flex items-center gap-2.5 rounded-2xl border border-charcoal-900/10 bg-white px-4 py-3.5 text-sm font-medium">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lagoon-800 text-ivory-50"><Check className="h-3.5 w-3.5" /></span>
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/devis" className="mt-7 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-clay-600 px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-clay-500">
              {ar ? "حدثنا عن مساحتك" : "Parlez-nous de votre espace"} <Arrow />
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-4">
              {GALLERY.slice(0, 4).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt={ar ? "أجواء خارجية حقيقية" : "Ambiance extérieure réelle"}
                  loading="lazy"
                  className={`w-full rounded-3xl object-cover ${i % 2 === 0 ? "aspect-[3/4]" : "mt-10 aspect-[3/4]"}`}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-lagoon-950 p-5 text-ivory-50">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-clay-500"><Shield className="h-5 w-5 text-white" /></span>
              <p className="text-sm leading-relaxed text-ivory-100/85">
                {ar ? "ضمان 3 سنوات: الشمس والحرارة والمطر مشمولة." : "Garantie 3 ans : soleil, chaleur et pluie couverts."}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════ POURQUOI — spec-sheet numérotée ══════════ */}
      <section aria-labelledby="pourquoi" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24">
        <Reveal>
          <h2 id="pourquoi" className="text-balance font-display text-3xl font-medium tracking-tight md:text-4xl">
            {ar ? "لماذا ديكو + مالتي آرتس" : "Pourquoi Déco + Multi-Arts"}
          </h2>
        </Reveal>
        <dl className="mt-8 overflow-hidden rounded-3xl border border-charcoal-900/10 bg-white">
          {strengths.map(([n, t, d], i) => (
            <Reveal key={t} delay={Math.min(i * 60, 240)}>
              <div className={`grid gap-2 px-6 py-5 sm:grid-cols-[64px_240px_1fr] sm:items-baseline sm:gap-6 md:px-8 ${i > 0 ? "border-t border-charcoal-900/10" : ""}`}>
                <dt className="font-display text-sm font-semibold tracking-[0.2em] text-clay-500">{n}</dt>
                <dt className="font-display text-lg font-medium">{t}</dt>
                <dd className="text-sm leading-relaxed text-charcoal-900/60">{d}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* ══════════ RÉALISATIONS — preuve par projets types ══════════ */}
      <section aria-labelledby="realisations" className="border-y border-charcoal-900/10 bg-ivory-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay-600">{ar ? "إنجازات" : "Réalisations"}</p>
            <h2 id="realisations" className="text-balance mt-3 max-w-2xl font-display text-3xl font-medium tracking-tight md:text-5xl">
              {ar ? "مشاريع تشبه مشروعك." : "Des projets comme le vôtre."}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {projects.map((r, i) => (
              <Reveal key={r.title} delay={i * 90}>
                <figure className="card-lift group overflow-hidden rounded-3xl border border-charcoal-900/10 bg-white">
                  <div className="img-zoom relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.img} alt={r.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                    <figcaption className="absolute left-4 top-4 rounded-full bg-lagoon-950/85 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory-50 backdrop-blur">
                      {r.tag}
                    </figcaption>
                  </div>
                  <div className="p-5">
                    <p className="font-display text-xl font-medium">{r.title}</p>
                    <Link href="/devis" className="link-sweep mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-clay-600">
                      {ar ? "مشروع مشابه؟ اطلب عرضك" : "Un projet similaire ? Chiffrez le vôtre"} <Arrow className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ SUR MESURE PRO — lagoon profond ══════════ */}
      <section aria-labelledby="surmesure" className="grain relative overflow-hidden bg-lagoon-950 text-ivory-50">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sand-300">{ar ? "مشاريع حسب الطلب والمهنيون" : "Projets sur mesure & professionnels"}</p>
            <h2 id="surmesure" className="text-balance mt-3 font-display text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl">
              {ar ? "برغولا بمقاس الشرفة، وأثاث بمقاس فندقك." : "Une pergola aux mesures de votre terrasse, du mobilier aux mesures de votre hôtel."}
            </h2>
            <ol className="mt-8 space-y-5">
              {[
                [ar ? "أرسل خططك وصورك" : "Envoyez plans & photos", ar ? "المدينة ونوع المكان والمقاسات التقريبية." : "Ville, type de lieu, dimensions approximatives."],
                [ar ? "استلم عرضنا المفصل" : "Recevez notre proposition", ar ? "مكالمة ثم عرض سعر مفصل." : "Échange téléphonique puis devis détaillé."],
                [ar ? "الصنع والتوصيل" : "Fabrication & livraison", ar ? "إنتاج متابع وتوصيل وتركيب حسب المشروع." : "Production suivie, livraison et pose selon projet."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="font-display text-sm font-semibold text-clay-400">0{i + 1}</span>
                  <div>
                    <p className="font-semibold">{t}</p>
                    <p className="mt-0.5 text-sm text-ivory-100/65">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/devis" className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-ivory-50 px-8 py-4 text-[15px] font-semibold text-lagoon-950 transition hover:-translate-y-0.5 hover:bg-white">
                {ar ? "تحدث عن مشروعك" : "Parler de votre projet"} <Arrow />
              </Link>
              <a href={waHref} target="_blank" rel="noreferrer" className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-[15px] font-semibold text-white transition hover:border-white/70 hover:bg-white/10">
                <WaIcon /> WhatsApp
              </a>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="img-zoom overflow-hidden rounded-3xl border border-white/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/pergola-daybed-sur-mesure.jpg" alt={ar ? "سرير خارجي حسب الطلب" : "Daybed sur mesure"} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </div>
            <p className="mt-3 text-center text-[13px] text-ivory-100/60">{ar ? "سرير دائري ملكي 2×2 م — عرض السعر مجاني على المخططات." : "Lit rond royal 2×2 m — devis gratuit sur plans."}</p>
          </Reveal>
        </div>
      </section>

      {/* ══════════ FAQ — lève les objections ══════════ */}
      <section aria-labelledby="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-clay-600">{ar ? "أسئلة شائعة" : "Questions fréquentes"}</p>
          <h2 id="faq" className="text-balance mt-3 text-center font-display text-3xl font-medium tracking-tight md:text-4xl">
            {ar ? "كل ما تحتاج معرفته قبل الطلب." : "Tout savoir avant de commander."}
          </h2>
        </Reveal>
        <div className="mt-8 space-y-3">
          {faqs.map(([q, a], i) => (
            <Reveal key={q} delay={Math.min(i * 60, 180)}>
              <details className="group rounded-2xl border border-charcoal-900/10 bg-white px-6 py-5 transition open:shadow-[0_20px_45px_-30px_rgba(8,29,25,0.4)]">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-medium [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory-100 text-xl leading-none transition group-open:rotate-45 group-open:bg-clay-600 group-open:text-white" aria-hidden="true">+</span>
                </summary>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-charcoal-900/65">{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════ CTA FINAL ══════════ */}
      <section aria-labelledby="cta" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-[2.5rem] bg-lagoon-950 px-6 py-14 text-center text-ivory-50 sm:px-12 md:py-20">
            <div className="absolute inset-0" aria-hidden="true">
              <img src="/salon-jardin-4.jpg" alt="" loading="lazy" className="h-full w-full object-cover opacity-25" />
              <div className="absolute inset-0 bg-gradient-to-t from-lagoon-950 via-lagoon-950/70 to-lagoon-950/40" />
            </div>
            <div className="relative mx-auto max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sand-300">{ar ? "جاهز عندما تكون أنت جاهزا" : "Prêt quand vous l'êtes"}</p>
              <h2 id="cta" className="text-balance mt-4 font-display text-4xl font-medium tracking-tight md:text-6xl">
                {ar ? "مشروعك يبدأ من هنا." : "Votre projet commence ici."}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-ivory-100/75">
                {ar ? "تصفح الكتالوج أو صف لنا مساحتك — سنرد عليك بعرض واضح." : "Parcourez le catalogue ou décrivez-nous votre espace — nous répondons avec une proposition claire."}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/produits" className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-clay-600 px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-clay-500">
                  {ar ? "تصفح الكتالوج" : "Voir le catalogue"} <Arrow />
                </Link>
                <a href={waHref} target="_blank" rel="noreferrer" className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-lagoon-600 px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-lagoon-700">
                  <WaIcon /> WhatsApp
                </a>
                <Link href="/devis" className="inline-flex min-h-[52px] items-center rounded-full border border-white/30 px-8 py-4 text-[15px] font-semibold text-white transition hover:border-white/70 hover:bg-white/10">
                  {ar ? "اطلب عرض سعر" : "Demander un devis"}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════ Sticky mobile WhatsApp — portée de pouce ══════════ */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-lagoon-950/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
        <div className="flex gap-2.5">
          <Link href="/produits" className="flex min-h-[52px] flex-1 items-center justify-center rounded-full bg-ivory-50 text-sm font-semibold text-lagoon-950">
            {ar ? "الكتالوج" : "Catalogue"}
          </Link>
          <a href={waHref} target="_blank" rel="noreferrer" className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-lagoon-600 text-sm font-semibold text-white">
            <WaIcon /> WhatsApp
          </a>
        </div>
      </div>
      <div className="h-[76px] md:hidden" aria-hidden="true" />
    </div>
  );
}
