import { cookies } from "next/headers";
import { LANG_COOKIE, type Lang } from "./format";

// Langue du site public (cookie dma_lang). Défaut : français.
export async function getLang(): Promise<Lang> {
  try {
    const c = await cookies();
    return c.get(LANG_COOKIE)?.value === "ar" ? "ar" : "fr";
  } catch {
    return "fr";
  }
}

// Choix FR/AR avec repli FR (données DB sans traduction).
export function pick<T>(lang: Lang, ar: T | null | undefined, fr: T): T {
  if (lang === "ar" && ar !== null && ar !== undefined && ar !== "") return ar;
  return fr;
}
