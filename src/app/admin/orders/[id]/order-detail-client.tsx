"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ORDER_STATUS_FR, formatTND, formatDateFR } from "@/lib/format";

type Props = {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    subtotal: number;
    total: number;
    notes: string | null;
    internalNotes: string | null;
    createdAt: string;
    customer: { fullName: string; phone: string; email: string | null; address: string | null; city: string | null; postalCode: string | null };
    items: { productName: string; productSlug: string | null; image: string | null; unitPrice: number; quantity: number; options: Record<string, string>; lineTotal: number }[];
  };
};

const FLOW = ["PENDING", "CONFIRMED", "PROCESSING", "READY", "DELIVERED"] as const;

export function OrderDetailClient({ order }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes] = useState(order.internalNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function save(nextStatus?: string) {
    if (nextStatus === "CANCELLED" && !confirm("Annuler cette commande ? Cette action est visible côté suivi client.")) return;
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, status: nextStatus ?? status, internalNotes: notes }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setMsg(data.error ?? "Erreur."); return; }
    setStatus(data.status);
    setMsg("Enregistré ✓");
    router.refresh();
  }

  return (
    <div>
      <Link href="/admin/orders" className="text-sm underline underline-offset-4">← Retour aux commandes</Link>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-semibold">{order.orderNumber}</h1>
        <span className="rounded-full bg-ivory-200 px-3 py-1 text-xs font-bold uppercase">{ORDER_STATUS_FR[status]}</span>
        <span className="text-sm text-charcoal-900/55">{formatDateFR(order.createdAt)}</span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-charcoal-900/10 bg-white p-5">
            <h2 className="font-semibold">Articles</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex justify-between gap-3 border-b border-charcoal-900/5 pb-3 last:border-0">
                  <span>
                    <strong>{i.productName}</strong> × {i.quantity}<br />
                    <span className="text-charcoal-900/55">{Object.entries(i.options).map(([k, v]) => `${k}: ${v}`).join(" · ")}</span>
                  </span>
                  <span className="font-bold">{formatTND(i.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-right font-display text-2xl font-semibold">Total : {formatTND(order.total)}</p>
            {order.notes && <p className="mt-2 rounded-xl bg-ivory-100 p-3 text-sm"><strong>Note client :</strong> {order.notes}</p>}
          </div>
          <div className="rounded-2xl border border-charcoal-900/10 bg-white p-5">
            <h2 className="font-semibold">Client</h2>
            <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
              <div><dt className="text-charcoal-900/55">Nom</dt><dd className="font-semibold">{order.customer.fullName}</dd></div>
              <div><dt className="text-charcoal-900/55">Téléphone</dt><dd className="font-semibold">{order.customer.phone}</dd></div>
              <div><dt className="text-charcoal-900/55">Email</dt><dd>{order.customer.email ?? "—"}</dd></div>
              <div><dt className="text-charcoal-900/55">Ville</dt><dd>{order.customer.city ?? "—"} {order.customer.postalCode ?? ""}</dd></div>
              <div className="sm:col-span-2"><dt className="text-charcoal-900/55">Adresse</dt><dd>{order.customer.address ?? "—"}</dd></div>
            </dl>
          </div>
        </div>

        <div className="h-fit rounded-2xl border border-charcoal-900/10 bg-white p-5">
          <h2 className="font-semibold">Changer le statut</h2>
          <div className="mt-3 grid gap-2">
            {FLOW.map((s) => (
              <button key={s} onClick={() => { setStatus(s); save(s); }} disabled={saving}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${status === s ? "bg-charcoal-900 text-ivory-50" : "border border-charcoal-900/20"}`}>
                {s === "PENDING" ? "↺ Nouvelle" : `Marquer : ${ORDER_STATUS_FR[s]}`}
              </button>
            ))}
            <button onClick={() => save("CANCELLED")} disabled={saving} className="rounded-full border border-red-900/30 px-4 py-2 text-sm font-semibold text-red-900">
              Annuler la commande
            </button>
          </div>
          <label className="mt-4 block text-sm font-medium">Notes internes
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="mt-1 w-full rounded-xl border border-charcoal-900/15 bg-ivory-50 p-3 text-sm outline-none" placeholder="Non visibles par le client…" />
          </label>
          <button onClick={() => save()} disabled={saving} className="mt-3 w-full rounded-full bg-bronze-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? "Enregistrement…" : "Enregistrer les notes"}
          </button>
          {msg && <p className="mt-2 text-sm text-emerald-900">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
