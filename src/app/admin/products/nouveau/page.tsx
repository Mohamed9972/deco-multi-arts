import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "../../layout";
import { ProductForm } from "../product-form";

export default async function NouveauProduit() {
  if (!(await getSession())) redirect("/admin/login");
  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold">Nouveau produit</h1>
      <ProductForm />
    </AdminShell>
  );
}
