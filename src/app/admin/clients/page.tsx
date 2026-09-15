import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "../layout";
import { ClientsClient } from "./clients-client";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  if (!(await getSession())) redirect("/admin/login");
  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold">Clients</h1>
      <ClientsClient />
    </AdminShell>
  );
}
