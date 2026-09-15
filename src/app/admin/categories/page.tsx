import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "../layout";
import { CategoriesClient } from "./categories-client";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  if (!(await getSession())) redirect("/admin/login");
  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold">Catégories</h1>
      <CategoriesClient />
    </AdminShell>
  );
}
