"use client";

import { useState } from "react";
import { orderStatusLabel, orderSteps, formatTND, formatDateFR, type Lang } from "@/lib/format";
import { STR } from "@/data/i18n";

type TrackResult = {
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { productName: string; quantity: number; unitPrice: number }[];
};

export function TrackForm({ lang }: { lang: Lang }) {
  const T = STR[lang];
  const [numero, setNumero] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!numero.trim() || !phone.trim()) {
      setError(T.s_err_empty);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: numero.trim(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? T.s_err_nf);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  const steps = orderSteps(lang);
  const stepIndex = result ? steps.findIndex((s) => s.key === result.status) : -1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">{T.s_title}</h1>
      <p className="mt-2 text-sm text-charcoal-900/60">{T.s_sub}</p>
      <form onSubmit={submit} className="mt-6 rounded-2xl border border-charcoal-900/10 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            {T.s_num}
            <input
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="CMD-2026-0042"
              className="mt-1 w-full rounded-xl border border-charcoal-900/15 bg-ivory-50 px-4 py-2.5 outline-none focus:border-bronze-600"
            />
          </label>
          <label className="text-sm font-medium">
            {T.s_phone}
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={T.ph_phone}
              className="mt-1 w-full rounded-xl border border-charcoal-900/15 bg-ivory-50 px-4 py-2.5 outline-none focus:border-bronze-600"
            />
          </label>
        </div>
        {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-900">{error}</p>}
        <button
          disabled={loading}
          className="mt-4 w-full rounded-full bg-charcoal-900 px-6 py-3 text-sm font-semibold text-ivory-50 disabled:opacity-60"
        >
          {loading ? T.s_search : T.s_btn}
        </button>
      </form>

      {result && (
        <div className="mt-6 rounded-2xl border border-charcoal-900/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="font-display text-xl font-semibold">
              {T.s_cmd} {result.orderNumber}
            </p>
            <span className="rounded-full bg-ivory-200 px-3 py-1 text-xs font-bold uppercase tracking-wide">
              {orderStatusLabel(result.status, lang)}
            </span>
          </div>
          <p className="mt-1 text-sm text-charcoal-900/60">
            {T.s_placed} {formatDateFR(result.createdAt)} — {T.s_total_w} {formatTND(result.total, lang)}
          </p>
          {result.status === "CANCELLED" ? (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-900">{T.s_cancelled}</p>
          ) : (
            <ol className="mt-5 space-y-3">
              {steps.map((s, i) => {
                const done = stepIndex >= 0 && i <= stepIndex;
                return (
                  <li key={s.key} className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${done ? "bg-emerald-900 text-white" : "border border-charcoal-900/20 text-charcoal-900/40"}`}
                    >
                      {done ? "✓" : "○"}
                    </span>
                    <span className={`text-sm ${done ? "font-semibold" : "text-charcoal-900/45"}`}>{s.label}</span>
                  </li>
                );
              })}
            </ol>
          )}
          <ul className="mt-5 border-t border-charcoal-900/10 pt-4 text-sm">
            {result.items.map((it, i) => (
              <li key={i} className="flex justify-between py-1">
                <span>
                  {it.productName} × {it.quantity}
                </span>
                <span className="font-semibold">{formatTND(it.unitPrice * it.quantity, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
