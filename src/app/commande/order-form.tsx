"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart-store";
import { formatTND, isValidTnPhone, type Lang } from "@/lib/format";
import { STR } from "@/data/i18n";

export function OrderForm({ lang }: { lang: Lang }) {
  const T = STR[lang];
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (items.length === 0) {
      setError(T.err_empty);
      return;
    }
    if (form.fullName.trim().length < 3) {
      setError(T.err_name);
      return;
    }
    if (!isValidTnPhone(form.phone)) {
      setError(T.err_phone2);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.name,
            productSlug: i.slug,
            image: i.image,
            unitPrice: i.unitPrice ?? 0,
            quantity: i.quantity,
            options: i.options,
          })),
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'enregistrement.");
      clear();
      router.push(`/commande/confirmation?numero=${encodeURIComponent(data.orderNumber)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-4xl font-semibold">{T.o_title}</h1>
        <p className="mt-3 text-charcoal-900/65">{T.o_empty}</p>
        <Link
          href="/produits"
          className="mt-6 inline-block rounded-full bg-charcoal-900 px-6 py-3 text-sm font-semibold text-ivory-50"
        >
          {T.cta_products}
        </Link>
      </div>
    );
  }

  const input =
    "mt-1 w-full rounded-xl border border-charcoal-900/15 bg-ivory-50 px-4 py-2.5 text-sm outline-none focus:border-bronze-600";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">{T.o_title}</h1>
      <p className="mt-2 text-sm text-charcoal-900/60">{T.o_sub}</p>
      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-charcoal-900/10 bg-white p-6">
          <h2 className="font-display text-xl font-semibold">{T.o_cust}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium sm:col-span-2">
              {T.f_name}
              <input required value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder={T.ph_name} className={input} />
            </label>
            <label className="text-sm font-medium">
              {T.f_phone}
              <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder={T.ph_phone} className={input} />
            </label>
            <label className="text-sm font-medium">
              {T.f_email}
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder={T.ph_email} className={input} />
            </label>
            <label className="text-sm font-medium sm:col-span-2">
              {T.f_address}
              <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder={T.ph_address} className={input} />
            </label>
            <label className="text-sm font-medium">
              {T.f_city}
              <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder={T.ph_city} className={input} />
            </label>
            <label className="text-sm font-medium">
              {T.f_postal}
              <input value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} placeholder={T.ph_postal} className={input} />
            </label>
            <label className="text-sm font-medium sm:col-span-2">
              {T.f_notes}
              <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3} placeholder={T.ph_notes} className={input} />
            </label>
          </div>
          {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-900">{error}</p>}
        </div>
        <aside className="h-fit rounded-2xl border border-charcoal-900/10 bg-white p-6">
          <h2 className="font-display text-xl font-semibold">{T.o_sum}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.key} className="flex justify-between gap-3">
                <span>
                  {i.name} × {i.quantity}
                  <br />
                  <span className="text-charcoal-900/55">
                    {Object.entries(i.options)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" · ")}
                  </span>
                </span>
                <span className="font-bold">{formatTND((i.unitPrice ?? 0) * i.quantity, lang)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-charcoal-900/10 pt-3">
            <span className="font-semibold">{T.o_total}</span>
            <span className="font-display text-2xl font-semibold">{formatTND(subtotal, lang)}</span>
          </div>
          <button
            disabled={loading}
            className="mt-5 w-full rounded-full bg-charcoal-900 px-6 py-3.5 text-sm font-semibold text-ivory-50 disabled:opacity-60"
          >
            {loading ? T.o_saving : T.o_confirm}
          </button>
          <p className="mt-3 text-xs text-charcoal-900/55">{T.o_note}</p>
        </aside>
      </form>
    </div>
  );
}
