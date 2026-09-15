"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatTND, PRODUCT_TYPE_FR } from "@/lib/format";

type P = {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  productType: string;
  available: boolean;
  featured: boolean;
  category: string | null;
};

export function ProductsClient() {
  const router = useRouter();
  const [items, setItems] = useState<P[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async (): Promise<P[]> => {
    const res = await fetch("/api/admin/products");
    if (res.status === 401) { router.replace("/admin/login"); return []; }
    const data = await res.json();
    return data.products ?? [];
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    fetchProducts().then((list) => {
      if (cancelled) return;
      setItems(list);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [fetchProducts]);

  async function toggle(p: P, field: "available" | "featured") {
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, name: p.name, [field]: !p[field] }),
    });
    setItems(await fetchProducts());
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Supprimer « ${name} » ?`)) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    setItems(await fetchProducts());
  }

  if (loading) return <p className="mt-4 text-sm">Chargement…</p>;
  if (items.length === 0) return <p className="mt-4 rounded-2xl border border-dashed p-8 text-center text-sm">Aucun produit. Créez le premier ou lancez le seed.</p>;

  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-charcoal-900/10 bg-white">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b text-left text-xs uppercase tracking-wide text-charcoal-900/55">
            <th className="p-3">Produit</th><th className="p-3">Prix</th><th className="p-3">Type</th><th className="p-3">Dispo</th><th className="p-3">Vedette</th><th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-b last:border-0">
              <td className="p-3"><strong>{p.name}</strong><br /><span className="text-charcoal-900/55">/{p.slug} · {p.category ?? "—"}</span></td>
              <td className="p-3 font-bold">{formatTND(p.price)}</td>
              <td className="p-3 text-[13px]">{PRODUCT_TYPE_FR[p.productType] ?? p.productType}</td>
              <td className="p-3">
                <button onClick={() => toggle(p, "available")} className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${p.available ? "bg-emerald-900/10 text-emerald-900" : "bg-red-900/10 text-red-900"}`}>
                  {p.available ? "Oui" : "Non"}
                </button>
              </td>
              <td className="p-3">
                <button onClick={() => toggle(p, "featured")} className="rounded-full border px-3 py-1 text-[11px] font-bold uppercase">
                  {p.featured ? "★" : "☆"}
                </button>
              </td>
              <td className="p-3 whitespace-nowrap">
                <Link href={`/admin/products/${p.id}`} className="font-semibold underline underline-offset-4">Modifier</Link>
                {" · "}
                <button onClick={() => remove(p.id, p.name)} className="text-red-800 underline underline-offset-4">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
