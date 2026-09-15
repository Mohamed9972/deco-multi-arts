import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, hasDb } from "@/lib/db";
import { normalizeTnPhone } from "@/lib/format";

const Schema = z.object({
  orderNumber: z.string().min(3),
  phone: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    if (!hasDb() || !prisma) {
      return NextResponse.json(
        { error: "Suivi indisponible en mode démo (base de données non configurée)." },
        { status: 503 },
      );
    }
    const orderNumber = parsed.data.orderNumber.trim().toUpperCase();
    const phone = normalizeTnPhone(parsed.data.phone);
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true, customer: true },
    });
    if (!order || normalizeTnPhone(order.customer.phone) !== phone) {
      return NextResponse.json({ error: "Commande introuvable. Vérifiez le numéro et le téléphone." }, { status: 404 });
    }
    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status,
      total: Number(order.total),
      createdAt: order.createdAt,
      items: order.items.map((i) => ({
        productName: i.productName,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
