"use client";

import { LANG_COOKIE, type Lang } from "@/lib/format";

// Bascule FR/AR : pose le cookie puis recharge (remonte tout l'arbre, serveur + client).
export function LangToggle({ lang }: { lang: Lang }) {
  const next: Lang = lang === "ar" ? "fr" : "ar";
  return (
    <button
      onClick={() => {
        document.cookie = `${LANG_COOKIE}=${next};path=/;max-age=31536000`;
        window.location.reload();
      }}
      aria-label={lang === "ar" ? "Passer au français" : "التبديل إلى العربية"}
      className="rounded-full border border-charcoal-900/20 px-3 py-2 text-[13px] font-bold transition hover:border-charcoal-900"
    >
      {lang === "ar" ? "FR" : "عربي"}
    </button>
  );
}
