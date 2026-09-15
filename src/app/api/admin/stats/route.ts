import { NextResponse } from "next/server";
import { prisma, hasDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  if (!hasDb() || !prisma) {
    return NextResponse.json({
      demo: true,
      totals: { orders: 0, pending: 0, quotes: 0, products: 0, customers: 0 },
      recentOrders: [],
      recentQuotes: [],
    });
  }
  const [totalOrders, pending, newQuotes, totalProducts, totalCustomers, recentOrders, recentQuotes] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.quoteRequest.count({ where: { status: "NEW" } }),
      prisma.product.count(),
      prisma.customer.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { customer: true },
      }),
      prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    ]);
  return NextResponse.json({
    totals: {
      orders: totalOrders,
      pending,
      quotes: newQuotes,
      products: totalProducts,
      customers: totalCustomers,
    },
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      total: Number(o.total),
      customer: o.customer.fullName,
      createdAt: o.createdAt,
    })),
    recentQuotes: recentQuotes.map((q) => ({
      id: q.id,
      quoteNumber: q.quoteNumber,
      status: q.status,
      fullName: q.fullName,
      city: q.city,
      createdAt: q.createdAt,
    })),
  });
}
