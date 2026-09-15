"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ORDER_STATUS_FR, QUOTE_STATUS_FR, formatTND, formatDateFR } from "@/lib/format";

type Stats = {
  demo?: boolean;
  totals: { orders: number; pending: number; quotes: number; products: number; customers: number };
  recentOrders: { id: string; orderNumber: string; status: string; total: number; customer: string; createdAt: string }[];
  recentQuotes: { id: string; quoteNumber: string; status: string; fullName: string; city: string | null; createdAt: string }[];
};

export function DashboardClient() {
  const router = useRouter();
  const [data, setData] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (r) => {
        if (r.status === 401) { router.replace("/admin/login"); return null; }
        return r.json();
      })
      .then((d) => d && setData(d))
      .catch(() => setError("Impossible de charger les statistiques."));
  }, [router]);

  if (error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-900">{error}</p>;
  if (!data) return <p className="text-sm text-charcoal-900/60">Chargement…</p>;

  const cards = [
    ["Commandes totales", data.totals.orders, "/admin/orders"],
    ["Nouvelles commandes", data.totals.pending, "/admin/orders?status=PENDING"],
    ["Devis en attente", data.totals.quotes, "/admin/devis"],
    ["Produits", data.totals.products, "/admin/products"],
    ["Clients", data.totals.customers, "/admin/clients"],
  ] as const;

  return (
    <div>
      {data.demo && (
        <p className="rounded-xl border border-amber-900/20 bg-amber-50 p-4 text-sm text-amber-950">
          Mode démo : base de données non configurée. Définissez <code>DATABASE_URL</code> (Neon) puis <code>npx prisma migrate deploy</code> et <code>npm run db:seed</code> pour activer le back-office complet.
        </p>
      )}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(([label, value, href]) => (
          <Link key={label} href={href} className="rounded-2xl border border-charcoal-900/10 bg-white p-5 hover:border-charcoal-900">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-charcoal-900/55">{label}</p>
            <p className="font-display mt-1 text-3xl font-semibold">{value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-charcoal-900/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Commandes récentes</h2>
            <Link href="/admin/orders" className="text-[13px] font-semibold underline underline-offset-4">Tout voir</Link>
          </div>
          {data.recentOrders.length === 0 ? <p className="mt-3 text-sm text-charcoal-900/55">Aucune commande.</p> : (
            <ul className="mt-3 divide-y divide-charcoal-900/10 text-sm">
              {data.recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between py-2">
                  <span><strong>{o.orderNumber}</strong> — {o.customer}<br /><span className="text-charcoal-900/55">{formatDateFR(o.createdAt)} · {formatTND(o.total)}</span></span>
                  <span className="rounded-full bg-ivory-200 px-2.5 py-1 text-[11px] font-bold uppercase">{ORDER_STATUS_FR[o.status]}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-charcoal-900/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Devis récents</h2>
            <Link href="/admin/devis" className="text-[13px] font-semibold underline underline-offset-4">Tout voir</Link>
          </div>
          {data.recentQuotes.length === 0 ? <p className="mt-3 text-sm text-charcoal-900/55">Aucune demande.</p> : (
            <ul className="mt-3 divide-y divide-charcoal-900/10 text-sm">
              {data.recentQuotes.map((q) => (
                <li key={q.id} className="flex items-center justify-between py-2">
                  <span><strong>{q.quoteNumber}</strong> — {q.fullName}{q.city ? ` (${q.city})` : ""}<br /><span className="text-charcoal-900/55">{formatDateFR(q.createdAt)}</span></span>
                  <span className="rounded-full bg-ivory-200 px-2.5 py-1 text-[11px] font-bold uppercase">{QUOTE_STATUS_FR[q.status]}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
