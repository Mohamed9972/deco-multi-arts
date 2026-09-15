"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDateFR } from "@/lib/format";

type C = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  city: string | null;
  ordersCount: number;
  lastOrder: string | null;
  createdAt: string;
};

export function ClientsClient() {
  const router = useRouter();
  const [items, setItems] = useState<C[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then(async (r) => {
        if (r.status === 401) { router.replace("/admin/login"); return { customers: [] }; }
        return r.json();
      })
      .then((d) => { setItems(d.customers ?? []); setLoading(false); });
  }, [router]);

  if (loading) return <p className="mt-4 text-sm">Chargement…</p>;
  if (items.length === 0) return <p className="mt-4 rounded-2xl border border-dashed p-8 text-center text-sm">Aucun client.</p>;

  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-charcoal-900/10 bg-white">
      <table className="w-full min-w-[680px] text-sm">
        <thead>
          <tr className="border-b text-left text-xs uppercase tracking-wide text-charcoal-900/55">
            <th className="p-3">Client</th><th className="p-3">Téléphone</th><th className="p-3">Ville</th><th className="p-3">Commandes</th><th className="p-3">Dernière</th><th className="p-3">Depuis</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id} className="border-b last:border-0">
              <td className="p-3 font-semibold">{c.fullName}<br /><span className="font-normal text-charcoal-900/55">{c.email ?? ""}</span></td>
              <td className="p-3">{c.phone}</td>
              <td className="p-3">{c.city ?? "—"}</td>
              <td className="p-3">{c.ordersCount}</td>
              <td className="p-3">{c.lastOrder ?? "—"}</td>
              <td className="p-3 text-charcoal-900/60">{formatDateFR(c.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
