import { NextResponse } from "next/server";
import { prisma, hasDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function guard() {
  const s = await getSession();
  return !!s;
}

// Liste commandes
export async function GET(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  if (!hasDb() || !prisma) return NextResponse.json({ orders: [], demo: true });
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const q = url.searchParams.get("q")?.trim();
  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(q
        ? {
            OR: [
              { orderNumber: { contains: q, mode: "insensitive" } },
              { customer: { fullName: { contains: q, mode: "insensitive" } } },
              { customer: { phone: { contains: q } } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { customer: true, items: true },
  });
  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      total: Number(o.total),
      customer: { fullName: o.customer.fullName, phone: o.customer.phone, city: o.customer.city },
      itemsCount: o.items.reduce((s, i) => s + i.quantity, 0),
      createdAt: o.createdAt,
    })),
  });
}

// Changement de statut
export async function PATCH(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  if (!hasDb() || !prisma) return NextResponse.json({ error: "Base non configurée." }, { status: 503 });
  const body = await req.json();
  const { id, status, internalNotes } = body as { id: string; status?: string; internalNotes?: string };
  if (!id) return NextResponse.json({ error: "ID manquant." }, { status: 400 });
  const allowed = ["PENDING", "CONFIRMED", "PROCESSING", "READY", "DELIVERED", "CANCELLED"];
  const data: Record<string, unknown> = {};
  if (status) {
    if (!allowed.includes(status)) return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    data.status = status;
  }
  if (typeof internalNotes === "string") data.internalNotes = internalNotes;
  const order = await prisma.order.update({ where: { id }, data: data as never });
  return NextResponse.json({ ok: true, status: order.status });
}
