"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QUOTE_STATUS_FR, PROJECT_TYPE_FR, formatDateFR } from "@/lib/format";

type Q = {
  id: string;
  quoteNumber: string;
  status: string;
  fullName: string;
  phone: string;
  email: string | null;
  company: string | null;
  city: string | null;
  projectType: string;
  productName: string | null;
  quantity: number | null;
  dimensions: string | null;
  budget: string | null;
  message: string | null;
  adminNotes: string | null;
  createdAt: string;
};

const STATUSES = ["", "NEW", "CONTACTED", "IN_PROGRESS", "SENT", "ACCEPTED", "REJECTED"];

export function QuotesClient() {
  const router = useRouter();
  const [items, setItems] = useState<Q[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  async function fetchQuotes(s = status): Promise<Q[]> {
    const res = await fetch(`/api/admin/quotes${s ? `?status=${s}` : ""}`);
    if (res.status === 401) { router.replace("/admin/login"); return []; }
    const data = await res.json();
    return data.quotes ?? [];
  }

  useEffect(() => {
    let cancelled = false;
    fetchQuotes().then((list) => {
      if (cancelled) return;
      setItems(list);
      setLoading(false);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function setStatusOf(id: string, next: string, adminNotes?: string) {
    await fetch("/api/admin/quotes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next, adminNotes }),
    });
    setEditing(null);
    setItems(await fetchQuotes());
  }

  if (loading) return <p className="mt-4 text-sm">Chargement…</p>;

  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-2">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-full border bg-white px-3 py-2 text-sm">
          <option value="">Tous statuts</option>
          {STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{QUOTE_STATUS_FR[s]}</option>)}
        </select>
      </div>
      {items.length === 0 && <p className="rounded-2xl border border-dashed p-8 text-center text-sm">Aucune demande.</p>}
      {items.map((q) => (
        <div key={q.id} className="rounded-2xl border border-charcoal-900/10 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold">{q.quoteNumber} — {q.fullName}</p>
            <span className="rounded-full bg-ivory-200 px-3 py-1 text-[11px] font-bold uppercase">{QUOTE_STATUS_FR[q.status]}</span>
          </div>
          <p className="mt-1 text-sm text-charcoal-900/65">
            {q.phone} · {q.email ?? "—"} · {q.city ?? "—"} · {PROJECT_TYPE_FR[q.projectType] ?? q.projectType} · {formatDateFR(q.createdAt)}
          </p>
          {q.productName && <p className="mt-1 text-sm"><strong>Produit :</strong> {q.productName} × {q.quantity ?? 1}</p>}
          {q.dimensions && <p className="mt-1 text-sm"><strong>Dimensions :</strong> {q.dimensions}</p>}
          {q.budget && <p className="mt-1 text-sm"><strong>Budget :</strong> {q.budget}</p>}
          {q.message && <p className="mt-2 rounded-xl bg-ivory-100 p-3 text-sm">{q.message}</p>}
          {editing === q.id ? (
            <div className="mt-3">
              <textarea defaultValue={q.adminNotes ?? ""} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full rounded-xl border p-3 text-sm" placeholder="Note interne…" />
              <div className="mt-2 flex gap-2">
                <select id={`st-${q.id}`} className="rounded-full border px-3 py-1.5 text-sm" defaultValue={q.status}>
                  {STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{QUOTE_STATUS_FR[s]}</option>)}
                </select>
                <button
                  onClick={() => {
                    const sel = document.getElementById(`st-${q.id}`) as HTMLSelectElement;
                    setStatusOf(q.id, sel.value, notes || q.adminNotes || "");
                  }}
                  className="rounded-full bg-charcoal-900 px-4 py-1.5 text-sm font-semibold text-ivory-50"
                >
                  Enregistrer
                </button>
                <button onClick={() => setEditing(null)} className="text-sm underline">Annuler</button>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              <button onClick={() => { setEditing(q.id); setNotes(q.adminNotes ?? ""); }} className="rounded-full border px-4 py-1.5 text-[13px] font-semibold">
                Changer statut / noter
              </button>
              <a href={`https://wa.me/216${q.phone.replace(/\D/g, "").slice(-8)}`} target="_blank" rel="noreferrer" className="rounded-full border px-4 py-1.5 text-[13px] font-semibold">
                WhatsApp →
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
