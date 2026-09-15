import { NextResponse } from "next/server";
import { prisma, hasDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  if (!hasDb() || !prisma) return NextResponse.json({ customers: [], demo: true });
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { _count: { select: { orders: true } }, orders: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  return NextResponse.json({
    customers: customers.map((c) => ({
      id: c.id,
      fullName: c.fullName,
      phone: c.phone,
      email: c.email,
      city: c.city,
      ordersCount: c._count.orders,
      lastOrder: c.orders[0]?.orderNumber ?? null,
      createdAt: c.createdAt,
    })),
  });
}
