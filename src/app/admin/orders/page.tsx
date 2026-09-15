import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "../layout";
import { OrdersClient } from "./orders-client";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  if (!(await getSession())) redirect("/admin/login");
  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold">Commandes</h1>
      <OrdersClient />
    </AdminShell>
  );
}
