import Link from "next/link";
import { STR } from "@/data/i18n";
import { PHONE_DISPLAY, PHONE_WA } from "@/data/fallback";
import type { Lang } from "@/lib/format";

export function Footer({ lang }: { lang: Lang }) {
  const T = STR[lang];
  const ar = lang === "ar";
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PHONE_WA;
  return (
    <footer className="bg-lagoon-950 text-ivory-100">
      {/* Bandeau réassurance */}
      <div className="border-b border-white/10">
        <ul className="mx-auto flex max-w-7xl flex-wrap gap-x-10 gap-y-3 px-4 py-6 text-[13px] font-medium text-ivory-100/75 sm:px-6">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-clay-400" aria-hidden="true" />
            {ar ? "ضمان 3 سنوات" : "Garantie 3 ans incluse"}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-clay-400" aria-hidden="true" />
            {ar ? "بدون دفع مسبق عبر الإنترنت" : "Sans paiement en ligne"}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-clay-400" aria-hidden="true" />
            {ar ? "صنع في تونس" : "Fabriqué en Tunisie"}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-clay-400" aria-hidden="true" />
            {ar ? "التوصيل لكامل تراب الجمهورية" : "Livraison dans toute la Tunisie"}
          </li>
        </ul>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-medium">{T.brand}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory-100/65">{T.ft_tag}</p>
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-lagoon-600 px-6 text-sm font-semibold text-white transition hover:bg-lagoon-700"
          >
            WhatsApp : <span dir="ltr">+{wa}</span>
          </a>
        </div>
        <nav aria-label={T.ft_cat}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand-300">{T.ft_cat}</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory-100/75">
            <li><Link href="/produits?categorie=chaises-longues" className="transition hover:text-white">Transat Marina</Link></li>
            <li><Link href="/produits?categorie=salons-jardin" className="transition hover:text-white">{ar ? "صالونات الحديقة" : "Salons de jardin"}</Link></li>
            <li><Link href="/produits?categorie=pergolas" className="transition hover:text-white">{ar ? "برغولات" : "Pergolas"}</Link></li>
            <li><Link href="/produits?categorie=pots-resine" className="transition hover:text-white">{ar ? "أحواض الريزين" : "Pots en résine"}</Link></li>
            <li><Link href="/devis" className="transition hover:text-white">{T.nav_quote}</Link></li>
          </ul>
        </nav>
        <nav aria-label={T.ft_ord}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand-300">{T.ft_ord}</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory-100/75">
            <li><Link href="/panier" className="transition hover:text-white">{T.nav_cart}</Link></li>
            <li><Link href="/commande/suivi" className="transition hover:text-white">{T.nav_track}</Link></li>
            <li><Link href="/devis" className="transition hover:text-white">{T.nav_quote}</Link></li>
            <li><Link href="/contact" className="transition hover:text-white">{T.nav_contact}</Link></li>
          </ul>
        </nav>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand-300">{T.ft_contact}</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory-100/75">
            <li>{T.ft_tn}</li>
            <li>
              <a href={`tel:+${wa}`} className="transition hover:text-white" dir="ltr">
                {PHONE_DISPLAY}
              </a>
            </li>
            <li><Link href="/admin" className="text-ivory-100/45 transition hover:text-white">{T.ft_pro}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-ivory-100/45 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {T.brand} — {T.ft_rights}</p>
          <p>{T.ft_cur}</p>
        </div>
      </div>
    </footer>
  );
}
