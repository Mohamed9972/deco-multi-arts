"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de connexion.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-600">Espace professionnel</p>
      <h1 className="font-display mt-2 text-3xl font-semibold">Connexion admin</h1>
      <form onSubmit={submit} className="mt-6 rounded-2xl border border-charcoal-900/10 bg-white p-6">
        <label className="text-sm font-medium">Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-charcoal-900/15 bg-ivory-50 px-4 py-2.5 outline-none focus:border-bronze-600" placeholder="admin@deco-multi-arts.tn" />
        </label>
        <label className="mt-4 block text-sm font-medium">Mot de passe
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-charcoal-900/15 bg-ivory-50 px-4 py-2.5 outline-none focus:border-bronze-600" />
        </label>
        {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-900">{error}</p>}
        <button disabled={loading} className="mt-5 w-full rounded-full bg-charcoal-900 px-6 py-3 text-sm font-semibold text-ivory-50 disabled:opacity-60">
          {loading ? "Connexion…" : "Se connecter"}
        </button>
        <p className="mt-3 text-xs text-charcoal-900/55">
          Démo sans base : admin@deco-multi-arts.tn / admin123 (configurable via ADMIN_EMAIL / ADMIN_PASSWORD).
        </p>
      </form>
    </div>
  );
}
