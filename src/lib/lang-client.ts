import { LANG_COOKIE, type Lang } from "./format";

// Choix FR/AR avec repli FR — version client-safe (voir aussi lang.ts côté serveur).
export function pick<T>(lang: Lang, ar: T | null | undefined, fr: T): T {
  if (lang === "ar" && ar !== null && ar !== undefined && ar !== "") return ar;
  return fr;
}

// Lecture cookie côté client (pages "use client" remontées après reload).
export function readLangCookie(): Lang {
  if (typeof document === "undefined") return "fr";
  return document.cookie.split(";").some((p) => p.trim() === `${LANG_COOKIE}=ar`) ? "ar" : "fr";
}
