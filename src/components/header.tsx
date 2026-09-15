import Link from "next/link";
import { CartBadge } from "./cart-badge";
import { LangToggle } from "./lang-toggle";
import { LOGO_IMAGE } from "@/data/fallback";
import { STR } from "@/data/i18n";
import type { Lang } from "@/lib/format";

export function Header({ lang }: { lang: Lang }) {
  const T = STR[lang];
  const ar = lang === "ar";
  const NAV = [
    { href: "/", label: T.nav_home },
    { href: "/produits", label: T.nav_products },
    { href: "/devis", label: T.nav_quote },
    { href: "/contact", label: T.nav_contact },
  ];
  return (
    <>
      {/* Barre d'annonce — réassurance + contact direct */}
      <div className="bg-lagoon-950 text-ivory-100">
        <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[12px] font-medium tracking-wide sm:px-6">
          <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-clay-400" aria-hidden="true" />
          {ar
            ? "التوصيل لكامل تونس · ضمان 3 سنوات · ‎+216 93 343 187"
            : "Livraison dans toute la Tunisie · Garantie 3 ans · +216 93 343 187"}
        </p>
      </div>
      <header className="sticky top-0 z-40 border-b border-charcoal-900/10 bg-ivory-50/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="flex min-h-[44px] items-center gap-2.5" aria-label={T.brand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_IMAGE} alt="" className="h-11 w-11 rounded-full border border-charcoal-900/10 object-cover" />
            <span className="font-display text-[1.35rem] font-semibold tracking-tight text-charcoal-900">
              {T.brand}
            </span>
          </Link>
          <nav aria-label={ar ? "التنقل الرئيسي" : "Navigation principale"} className="hidden items-center gap-7 text-[13px] font-medium uppercase tracking-[0.14em] text-charcoal-900/65 lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="link-sweep transition hover:text-charcoal-900">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/commande/suivi"
              className="hidden min-h-[44px] items-center px-2 text-[13px] font-medium text-charcoal-900/60 transition hover:text-charcoal-900 sm:inline-flex"
            >
              {T.nav_track}
            </Link>
            <Link
              href="/devis"
              className="hidden min-h-[44px] items-center rounded-full bg-clay-600 px-5 text-[13px] font-semibold text-white transition hover:bg-clay-500 md:inline-flex"
            >
              {T.nav_quote}
            </Link>
            <LangToggle lang={lang} />
            <CartBadge lang={lang} />
            <Link
              href="/produits"
              className="inline-flex min-h-[44px] items-center rounded-full border border-charcoal-900/20 px-4 text-[13px] font-semibold lg:hidden"
            >
              {T.nav_catalogue}
            </Link>
          </div>
        </div>
        <div className="border-t border-charcoal-900/10 lg:hidden">
          <nav aria-label={ar ? "التنقل" : "Navigation"} className="no-scrollbar mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] text-charcoal-900/65">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap py-1">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
