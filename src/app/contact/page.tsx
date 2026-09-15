import { getLang } from "@/lib/lang";
import { STR } from "@/data/i18n";
import { PHONE_DISPLAY, PHONE_WA } from "@/data/fallback";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const lang = await getLang();
  const T = STR[lang];
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PHONE_WA;
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-600">{T.c_eyebrow}</p>
      <h1 className="font-display mt-2 text-4xl font-semibold md:text-5xl">{T.c_title}</h1>
      <p className="mt-3 text-charcoal-900/65">{T.c_sub}</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <a
          href={`https://wa.me/${wa}?text=${encodeURIComponent(
            lang === "ar" ? "مرحبا ديكو + مالتي آرتس، أريد استفسارا." : "Bonjour Déco + Multi-Arts, je souhaite un renseignement.",
          )}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl bg-charcoal-950 p-6 text-ivory-50"
        >
          <p className="font-display text-xl font-semibold">{T.c_wa_t}</p>
          <p className="mt-1 text-sm text-ivory-100/70">{T.c_wa_d}</p>
          <p className="mt-3 text-sm font-bold underline underline-offset-4">{T.c_chat}</p>
        </a>
        <a href={`tel:+${wa}`} className="rounded-2xl border border-charcoal-900/10 bg-white p-6">
          <p className="font-display text-xl font-semibold">{T.c_phone_t}</p>
          <p className="mt-1 text-sm text-charcoal-900/65">{T.c_phone_d}</p>
          <p className="mt-3 text-sm font-bold underline underline-offset-4" dir="ltr">
            {PHONE_DISPLAY}
          </p>
          <p className="mt-2 text-[13px] font-semibold text-bronze-700">{T.c_call}</p>
        </a>
        <div className="rounded-2xl border border-charcoal-900/10 bg-white p-6">
          <p className="font-display text-xl font-semibold">{T.c_box_t}</p>
          <p className="mt-1 text-sm text-charcoal-900/65">{T.c_box_d}</p>
          <div className="mt-3 flex gap-2">
            <a href="/commande/suivi" className="rounded-full bg-charcoal-900 px-4 py-2 text-[13px] font-semibold text-ivory-50">
              {T.nav_track}
            </a>
            <a href="/devis" className="rounded-full border border-charcoal-900/20 px-4 py-2 text-[13px] font-semibold">
              {T.nav_quote}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
