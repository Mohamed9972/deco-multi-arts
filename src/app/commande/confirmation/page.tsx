import Link from "next/link";
import { whatsappLink } from "@/lib/format";
import { getLang } from "@/lib/lang";
import { STR } from "@/data/i18n";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ numero?: string }>;
}) {
  const { numero } = await searchParams;
  const lang = await getLang();
  const T = STR[lang];
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <p className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-900 text-2xl text-white">
        ✓
      </p>
      <h1 className="font-display mt-5 text-4xl font-semibold">{T.cf_title}</h1>
      {numero && (
        <p className="mt-3 rounded-2xl border border-charcoal-900/10 bg-white p-4 text-lg">
          {T.cf_num} <strong className="font-display">{numero}</strong>
        </p>
      )}
      <p className="mt-4 text-charcoal-900/65">{T.cf_text}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href={`/commande/suivi${numero ? `?numero=${encodeURIComponent(numero)}` : ""}`}
          className="rounded-full bg-charcoal-900 px-6 py-3 text-sm font-semibold text-ivory-50"
        >
          {T.cf_track}
        </Link>
        <a
          href={whatsappLink(
            lang === "ar" ? "لقد قدمت طلبا على الموقع." : "je viens de passer une commande sur le site.",
            numero,
          )}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-charcoal-900/25 px-6 py-3 text-sm font-semibold"
        >
          {T.cf_wa}
        </a>
        <Link href="/produits" className="rounded-full border border-charcoal-900/25 px-6 py-3 text-sm font-semibold">
          {T.cf_back}
        </Link>
      </div>
    </div>
  );
}
