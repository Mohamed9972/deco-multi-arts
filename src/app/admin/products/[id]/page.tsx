import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "../../layout";
import { ProductForm } from "../product-form";

export default async function EditProduit({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) redirect("/admin/login");
  const { id } = await params;
  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold">Modifier le produit</h1>
      <ProductForm initialId={id} />
    </AdminShell>
  );
}
