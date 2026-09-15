"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ORDER_STATUS_FR, formatTND, formatDateFR } from "@/lib/format";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  customer: { fullName: string; phone: string; city: string | null };
  itemsCount: number;
  createdAt: string;
};

const STATUSES = ["", "PENDING", "CONFIRMED", "PROCESSING", "READY", "DELIVERED", "CANCELLED"];

export function OrdersClient() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchOrders(s = status, query = q): Promise<Order[]> {
    const params = new URLSearchParams();
    if (s) params.set("status", s);
    if (query) params.set("q", query);
    const res = await fetch(`/api/admin/orders?${params.toString()}`);
    if (res.status === 401) { router.replace("/admin/login"); return []; }
    const data = await res.json();
    return data.orders ?? [];
  }

  async function search() {
    setLoading(true);
    setOrders(await fetchOrders());
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    fetchOrders().then((list) => {
      if (cancelled) return;
      setOrders(list);
      setLoading(false);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-charcoal-900/10 bg-white p-4 md:flex-row md:items-center">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Rechercher (numéro, nom, téléphone)…" className="w-full rounded-full border border-charcoal-900/15 bg-ivory-50 px-4 py-2 text-sm outline-none md:max-w-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-full border border-charcoal-900/15 bg-ivory-50 px-3 py-2 text-sm">
          <option value="">Tous statuts</option>
          {STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{ORDER_STATUS_FR[s]}</option>)}
        </select>
        <button onClick={search} className="rounded-full bg-charcoal-900 px-5 py-2 text-sm font-semibold text-ivory-50">Rechercher</button>
      </div>
      {loading ? <p className="mt-4 text-sm">Chargement…</p> : orders.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-charcoal-900/20 p-8 text-center text-sm">Aucune commande.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-charcoal-900/10 bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-charcoal-900/10 text-left text-xs uppercase tracking-wide text-charcoal-900/55">
                <th className="p-3">N°</th><th className="p-3">Client</th><th className="p-3">Articles</th><th className="p-3">Total</th><th className="p-3">Statut</th><th className="p-3">Date</th><th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-charcoal-900/5 last:border-0">
                  <td className="p-3 font-bold">{o.orderNumber}</td>
                  <td className="p-3">{o.customer.fullName}<br /><span className="text-charcoal-900/55">{o.customer.phone}{o.customer.city ? ` · ${o.customer.city}` : ""}</span></td>
                  <td className="p-3">{o.itemsCount}</td>
                  <td className="p-3 font-bold">{formatTND(o.total)}</td>
                  <td className="p-3"><span className="rounded-full bg-ivory-200 px-2.5 py-1 text-[11px] font-bold uppercase">{ORDER_STATUS_FR[o.status]}</span></td>
                  <td className="p-3 text-charcoal-900/60">{formatDateFR(o.createdAt)}</td>
                  <td className="p-3"><Link href={`/admin/orders/${o.id}`} className="font-semibold underline underline-offset-4">Ouvrir</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
