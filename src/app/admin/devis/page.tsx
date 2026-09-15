import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "../layout";
import { QuotesClient } from "./quotes-client";

export const dynamic = "force-dynamic";

export default async function AdminDevisPage() {
  if (!(await getSession())) redirect("/admin/login");
  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold">Demandes de devis</h1>
      <QuotesClient />
    </AdminShell>
  );
}
