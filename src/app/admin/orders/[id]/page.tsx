import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma, hasDb } from "@/lib/db";
import { AdminShell } from "../../layout";
import { OrderDetailClient } from "./order-detail-client";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) redirect("/admin/login");
  const { id } = await params;
  if (!hasDb() || !prisma) {
    return (
      <AdminShell>
        <p className="rounded-xl bg-amber-50 p-4 text-sm">Base non configurée : détail indisponible en mode démo.</p>
      </AdminShell>
    );
  }
  const order = await prisma.order.findUnique({
    where: { id },
    include: { customer: true, items: true },
  });
  if (!order) notFound();
  return (
    <AdminShell>
      <OrderDetailClient
        order={{
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          subtotal: Number(order.subtotal),
          total: Number(order.total),
          notes: order.notes,
          internalNotes: order.internalNotes,
          createdAt: String(order.createdAt),
          customer: {
            fullName: order.customer.fullName,
            phone: order.customer.phone,
            email: order.customer.email,
            address: order.customer.address,
            city: order.customer.city,
            postalCode: order.customer.postalCode,
          },
          items: order.items.map((i) => ({
            productName: i.productName,
            productSlug: i.productSlug,
            image: i.image,
            unitPrice: Number(i.unitPrice),
            quantity: i.quantity,
            options: (i.options as Record<string, string>) ?? {},
            lineTotal: Number(i.lineTotal),
          })),
        }}
      />
    </AdminShell>
  );
}
