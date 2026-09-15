import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "./logout-button";

const NAV = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/orders", label: "Commandes" },
  { href: "/admin/devis", label: "Devis" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/clients", label: "Clients" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // La page login gère son propre cas
  return <>{children}</>;
}

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-600">Déco + Multi-Arts — Admin</p>
          <p className="text-sm text-charcoal-900/60">Connecté : {session.email}</p>
        </div>
        <LogoutButton />
      </div>
      <nav className="mt-5 flex flex-wrap gap-2">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="rounded-full border border-charcoal-900/15 bg-white px-4 py-2 text-[13px] font-semibold hover:border-charcoal-900">
            {n.label}
          </Link>
        ))}
        <Link href="/" className="rounded-full px-4 py-2 text-[13px] font-medium text-charcoal-900/60 hover:underline">
          ← Voir le site
        </Link>
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
