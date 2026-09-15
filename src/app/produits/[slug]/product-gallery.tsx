"use client";

import { useCallback, useEffect, useState } from "react";
import { AvailabilityBadge } from "@/components/product-card";
import { productTypeLabel, type Lang } from "@/lib/format";
import { STR } from "@/data/i18n";

export function ProductGallery({
  images,
  name,
  available,
  productType,
  lang,
}: {
  images: string[];
  name: string;
  available: boolean;
  productType: string;
  lang: Lang;
}) {
  const T = STR[lang];
  const list = images.length > 0 ? images : ["/transat-marina-1.jpg"];
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = useCallback(() => setIndex((i) => (i - 1 + list.length) % list.length), [list.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % list.length), [list.length]);

  // Clavier : ←/→ naviguent, Échap ferme le plein écran
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, prev, next]);

  const current = list[index];

  return (
    <div>
      {/* ——— Image principale ——— */}
      <div className="group relative overflow-hidden rounded-3xl border border-charcoal-900/10 bg-white shadow-[0_30px_60px_-30px_rgba(8,29,25,0.35)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current}
          src={current}
          alt={`${name} — photo ${index + 1}`}
          className="aspect-[4/3] w-full animate-fade-up object-cover"
        />

        {/* Badges */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <AvailabilityBadge available={available} lang={lang} />
          <span className="rounded-full bg-ivory-50/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-900 backdrop-blur">
            {productTypeLabel(productType, lang)}
          </span>
        </div>

        {/* Compteur + plein écran */}
        <div className="absolute right-4 top-4 flex items-center gap-2">
          {list.length > 1 && (
            <span className="rounded-full bg-charcoal-950/70 px-3 py-1.5 text-xs font-semibold tabular-nums text-ivory-50 backdrop-blur">
              {index + 1} / {list.length}
            </span>
          )}
          <button
            onClick={() => setLightbox(true)}
            aria-label={T.d_fullscreen}
            title={T.d_fullscreen}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory-50/90 text-lg text-charcoal-900 backdrop-blur transition hover:bg-ivory-50"
          >
            ⛶
          </button>
        </div>

        {/* Flèches */}
        {list.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label={T.d_prev}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory-50/90 text-xl text-charcoal-900 opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100 hover:bg-ivory-50 focus-visible:opacity-100 max-lg:opacity-100"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label={T.d_next}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory-50/90 text-xl text-charcoal-900 opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100 hover:bg-ivory-50 focus-visible:opacity-100 max-lg:opacity-100"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* ——— Miniatures cliquables ——— */}
      {list.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {list.map((src, i) => {
            const active = i === index;
            return (
              <button
                key={`${src}-${i}`}
                onClick={() => setIndex(i)}
                aria-label={`${T.d_photo} ${i + 1}`}
                aria-current={active}
                className={`relative overflow-hidden rounded-2xl border-2 transition ${
                  active
                    ? "border-clay-500 shadow-[0_10px_25px_-10px_rgba(194,104,42,0.6)]"
                    : "border-charcoal-900/10 opacity-70 hover:border-charcoal-900/30 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${name} — miniature ${i + 1}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                {active && <span className="absolute inset-x-0 bottom-0 h-1 bg-clay-500" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}

      {/* ——— Lightbox plein écran ——— */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={name}
          className="fixed inset-0 z-[90] flex flex-col bg-charcoal-950/95 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setLightbox(false)}
        >
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 py-2 text-ivory-50">
            <p className="truncate text-sm font-medium">
              {name} <span className="ml-2 tabular-nums opacity-60">{index + 1} / {list.length}</span>
            </p>
            <button
              onClick={() => setLightbox(false)}
              aria-label={T.d_close}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-xl transition hover:bg-white/10"
            >
              ✕
            </button>
          </div>
          <div
            className="relative mx-auto flex w-full max-w-5xl flex-1 items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={current}
              src={current}
              alt={`${name} — photo ${index + 1}`}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            {list.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label={T.d_prev}
                  className="absolute left-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur transition hover:bg-white/25 sm:-left-2"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  aria-label={T.d_next}
                  className="absolute right-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur transition hover:bg-white/25 sm:-right-2"
                >
                  ›
                </button>
              </>
            )}
          </div>
          {list.length > 1 && (
            <div
              className="no-scrollbar mx-auto mt-4 flex w-full max-w-5xl gap-2 overflow-x-auto pb-2"
              onClick={(e) => e.stopPropagation()}
            >
              {list.map((src, i) => (
                <button
                  key={`lb-${src}-${i}`}
                  onClick={() => setIndex(i)}
                  aria-label={`${T.d_photo} ${i + 1}`}
                  className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    i === index ? "border-clay-400" : "border-white/15 opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
