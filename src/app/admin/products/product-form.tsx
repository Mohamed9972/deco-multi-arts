"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Cat = { id: string; name: string };

export function ProductForm({ initialId }: { initialId?: string }) {
  const router = useRouter();
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    price: "",
    productType: "DIRECT",
    available: true,
    featured: false,
    categoryId: "",
    material: "",
    colors: "",
    specifications: "",
    coverImage: "",
    images: "",
  });

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then((d) => setCats(d.categories ?? [])).catch(() => {});
    if (initialId) {
      fetch("/api/admin/products").then((r) => r.json()).then((d) => {
        const p = (d.products ?? []).find((x: { id: string }) => x.id === initialId);
        if (p) {
          setForm((f) => ({
            ...f,
            name: p.name ?? "",
            slug: p.slug ?? "",
            shortDescription: p.shortDescription ?? "",
            description: p.description ?? "",
            price: p.price?.toString() ?? "",
            productType: p.productType ?? "DIRECT",
            available: p.available ?? true,
            featured: p.featured ?? false,
            categoryId: p.categoryId ?? "",
            material: p.material ?? "",
            colors: (p.colors ?? []).join(", "),
            specifications: (p.specifications ?? []).join("\n"),
            coverImage: p.coverImage ?? "",
            images: (p.images ?? []).join("\n"),
          }));
        }
      }).catch(() => {});
    }
  }, [initialId]);

  function set(k: string, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) { setError(data.error ?? "Échec envoi."); return; }
    set("coverImage", data.url);
    setForm((f) => ({ ...f, images: f.images ? `${f.images}\n${data.url}` : data.url }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("Nom requis.");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initialId,
          name: form.name.trim(),
          slug: form.slug.trim() || undefined,
          shortDescription: form.shortDescription || undefined,
          description: form.description || undefined,
          price: form.price === "" ? null : parseFloat(form.price),
          productType: form.productType,
          available: form.available,
          featured: form.featured,
          categoryId: form.categoryId || null,
          material: form.material || undefined,
          colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
          specifications: form.specifications.split("\n").map((s) => s.trim()).filter(Boolean),
          coverImage: form.coverImage || undefined,
          images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur.");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  const input = "mt-1 w-full rounded-xl border border-charcoal-900/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-bronze-600";

  return (
    <form onSubmit={submit} className="mt-4 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="rounded-2xl border border-charcoal-900/10 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Nom *<input value={form.name} onChange={(e) => set("name", e.target.value)} className={input} /></label>
          <label className="text-sm font-medium">Slug (auto si vide)<input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={input} placeholder="transat-marina" /></label>
          <label className="text-sm font-medium sm:col-span-2">Description courte<textarea value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} rows={2} className={input} /></label>
          <label className="text-sm font-medium sm:col-span-2">Description<textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={5} className={input} /></label>
          <label className="text-sm font-medium">Matériau<input value={form.material} onChange={(e) => set("material", e.target.value)} className={input} /></label>
          <label className="text-sm font-medium">Catégorie
            <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={input}>
              <option value="">— Sans catégorie —</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium sm:col-span-2">Coloris (séparés par virgule)<input value={form.colors} onChange={(e) => set("colors", e.target.value)} className={input} placeholder="Blanc, Sable, Terracotta" /></label>
          <label className="text-sm font-medium sm:col-span-2">Caractéristiques (une par ligne)<textarea value={form.specifications} onChange={(e) => set("specifications", e.target.value)} rows={4} className={input} /></label>
        </div>
      </div>
      <div className="h-fit space-y-4 rounded-2xl border border-charcoal-900/10 bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <label className="text-sm font-medium">Prix (DT)<input type="number" step="0.001" value={form.price} onChange={(e) => set("price", e.target.value)} className={input} placeholder="Vide = sur devis" /></label>
          <label className="text-sm font-medium">Type
            <select value={form.productType} onChange={(e) => set("productType", e.target.value)} className={input}>
              <option value="DIRECT">Achat direct</option>
              <option value="ON_REQUEST">Sur commande</option>
              <option value="QUOTATION">Sur devis</option>
            </select>
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.available} onChange={(e) => set("available", e.target.checked)} /> Disponible</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> En vedette (accueil)</label>
        <label className="block text-sm font-medium">Image de couverture (URL)
          <input value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} className={input} placeholder="https://… ou /uploads/…" />
        </label>
        <label className="block text-sm font-medium">Envoyer une image
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} className="mt-1 text-sm" />
          {uploading && <span className="text-xs">Envoi…</span>}
        </label>
        <label className="block text-sm font-medium">Galerie (une URL par ligne)
          <textarea value={form.images} onChange={(e) => set("images", e.target.value)} rows={4} className={input} />
        </label>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-900">{error}</p>}
        <button disabled={loading} className="w-full rounded-full bg-charcoal-900 px-6 py-3 text-sm font-semibold text-ivory-50 disabled:opacity-60">
          {loading ? "Enregistrement…" : initialId ? "Enregistrer" : "Créer le produit"}
        </button>
      </div>
    </form>
  );
}
