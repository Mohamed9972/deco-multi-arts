"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Cat = { id: string; name: string; slug: string; description: string | null; image: string | null; active: boolean; featured: boolean };

export function CategoriesClient() {
  const router = useRouter();
  const [items, setItems] = useState<Cat[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const fetchCategories = useCallback(async (): Promise<Cat[]> => {
    const res = await fetch("/api/admin/categories");
    if (res.status === 401) { router.replace("/admin/login"); return []; }
    const data = await res.json();
    return data.categories ?? [];
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    fetchCategories().then((cats) => { if (!cancelled) setItems(cats); });
    return () => { cancelled = true; };
  }, [fetchCategories]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return;
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description, image }),
    });
    setName(""); setDescription(""); setImage("");
    fetchCategories().then((cats) => setItems(cats));
  }

  async function remove(id: string, n: string) {
    if (!confirm(`Supprimer la catégorie « ${n} » ?`)) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    fetchCategories().then((cats) => setItems(cats));
  }

  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <form onSubmit={create} className="h-fit rounded-2xl border border-charcoal-900/10 bg-white p-5">
        <h2 className="font-semibold">Nouvelle catégorie</h2>
        <label className="mt-3 block text-sm">Nom *<input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border bg-ivory-50 px-3 py-2 text-sm outline-none" placeholder="Pergolas" /></label>
        <label className="mt-3 block text-sm">Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border bg-ivory-50 px-3 py-2 text-sm outline-none" /></label>
        <label className="mt-3 block text-sm">Image (URL)<input value={image} onChange={(e) => setImage(e.target.value)} className="mt-1 w-full rounded-xl border bg-ivory-50 px-3 py-2 text-sm outline-none" placeholder="https://…" /></label>
        <button className="mt-4 w-full rounded-full bg-charcoal-900 px-4 py-2.5 text-sm font-semibold text-ivory-50">Créer</button>
      </form>
      <div className="space-y-3">
        {items.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-2xl border border-charcoal-900/10 bg-white p-4 text-sm">
            <div><strong>{c.name}</strong> <span className="text-charcoal-900/50">/{c.slug}</span><br /><span className="text-charcoal-900/60">{c.description ?? ""}</span></div>
            <button onClick={() => remove(c.id, c.name)} className="text-red-800 underline underline-offset-4">Supprimer</button>
          </div>
        ))}
        {items.length === 0 && <p className="rounded-2xl border border-dashed p-6 text-center text-sm">Aucune catégorie.</p>}
      </div>
    </div>
  );
}
