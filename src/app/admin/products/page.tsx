import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { AdminShell } from "../layout";
import { ProductsClient } from "./products-client";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  if (!(await getSession())) redirect("/admin/login");
  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Produits</h1>
        <Link href="/admin/products/nouveau" className="rounded-full bg-charcoal-900 px-5 py-2.5 text-sm font-semibold text-ivory-50">
          + Nouveau produit
        </Link>
      </div>
      <ProductsClient />
    </AdminShell>
  );
}
