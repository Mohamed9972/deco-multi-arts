"use client";

import { useState } from "react";
import Link from "next/link";
import { projectTypeLabel, PROJECT_TYPE_FR, isValidTnPhone, type Lang } from "@/lib/format";
import { STR } from "@/data/i18n";

const PROJECTS = Object.keys(PROJECT_TYPE_FR);

export function DevisForm({ lang }: { lang: Lang }) {
  const T = STR[lang];
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    company: "",
    city: "",
    projectType: "VILLA",
    productName: "",
    quantity: "1",
    dimensions: "",
    budget: "",
    message: "",
  });
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.fullName.trim().length < 3) return setError(T.err_name);
    if (!isValidTnPhone(form.phone)) return setError(T.err_phone);
    setLoading(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, quantity: parseInt(form.quantity) || 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur.");
      setDone(data.quoteNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-900 text-2xl text-white">
          ✓
        </p>
        <h1 className="font-display mt-5 text-4xl font-semibold">{T.done_t}</h1>
        <p className="mt-3 rounded-2xl border border-charcoal-900/10 bg-white p-4">
          {T.done_ref} <strong className="font-display text-lg">{done}</strong>
        </p>
        <p className="mt-3 text-charcoal-900/65">{T.done_d}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/produits" className="rounded-full bg-charcoal-900 px-6 py-3 text-sm font-semibold text-ivory-50">
            {T.cta_products}
          </Link>
          <Link href="/" className="rounded-full border border-charcoal-900/25 px-6 py-3 text-sm font-semibold">
            {T.nav_home}
          </Link>
        </div>
      </div>
    );
  }

  const input =
    "mt-1 w-full rounded-xl border border-charcoal-900/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-bronze-600";

  const steps = [
    ["01", T.s1t, T.s1d],
    ["02", T.s2t, T.s2d],
    ["03", T.s3t, T.s3d],
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-600">{T.q_eyebrow}</p>
      <h1 className="font-display mt-2 text-4xl font-semibold md:text-5xl">{T.q_title}</h1>
      <p className="mt-3 text-charcoal-900/65">{T.q_sub}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map(([n, t, d]) => (
          <div key={n} className="rounded-2xl border border-charcoal-900/10 bg-white p-5">
            <p className="font-display text-2xl text-bronze-600">{n}</p>
            <p className="mt-1 font-semibold">{t}</p>
            <p className="mt-1 text-sm text-charcoal-900/65">{d}</p>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 rounded-2xl border border-charcoal-900/10 bg-ivory-100 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            {T.f_name}
            <input required value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className={input} placeholder={T.ph_name} />
          </label>
          <label className="text-sm font-medium">
            {T.f_phone}
            <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} className={input} placeholder={T.ph_phone} />
          </label>
          <label className="text-sm font-medium">
            {T.f_email}
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={input} placeholder={T.ph_email} />
          </label>
          <label className="text-sm font-medium">
            {T.f_company}
            <input value={form.company} onChange={(e) => set("company", e.target.value)} className={input} placeholder={T.ph_company} />
          </label>
          <label className="text-sm font-medium">
            {T.f_city}
            <input value={form.city} onChange={(e) => set("city", e.target.value)} className={input} placeholder={T.ph_city} />
          </label>
          <label className="text-sm font-medium">
            {T.f_ptype}
            <select value={form.projectType} onChange={(e) => set("projectType", e.target.value)} className={input}>
              {PROJECTS.map((k) => (
                <option key={k} value={k}>
                  {projectTypeLabel(k, lang)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            {T.f_product}
            <input value={form.productName} onChange={(e) => set("productName", e.target.value)} className={input} placeholder={T.ph_product} />
          </label>
          <label className="text-sm font-medium">
            {T.f_qty}
            <input type="number" min={1} value={form.quantity} onChange={(e) => set("quantity", e.target.value)} className={input} />
          </label>
          <label className="text-sm font-medium sm:col-span-2">
            {T.f_dims}
            <textarea value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} rows={2} className={input} placeholder={T.ph_dims} />
          </label>
          <label className="text-sm font-medium">
            {T.f_budget}
            <input value={form.budget} onChange={(e) => set("budget", e.target.value)} className={input} placeholder={T.ph_budget} />
          </label>
          <label className="text-sm font-medium">
            {T.f_msg}
            <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={4} className={input} placeholder={T.ph_msg} />
          </label>
        </div>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-900">{error}</p>}
        <button
          disabled={loading}
          className="mt-5 w-full rounded-full bg-charcoal-900 px-6 py-3.5 text-sm font-semibold text-ivory-50 disabled:opacity-60"
        >
          {loading ? T.sending : T.submit}
        </button>
        <p className="mt-3 text-center text-xs text-charcoal-900/55">{T.noengage}</p>
      </form>
    </div>
  );
}
