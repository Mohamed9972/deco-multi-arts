import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "./layout";
import { DashboardClient } from "./dashboard-client";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <AdminShell>
      <DashboardClient />
    </AdminShell>
  );
}
