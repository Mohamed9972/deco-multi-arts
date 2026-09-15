import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, hasDb } from "@/lib/db";
import { nextOrderNumber, normalizeTnPhone, isValidTnPhone } from "@/lib/format";

const ItemSchema = z.object({
  productId: z.string().optional(),
  productName: z.string().min(1),
  productSlug: z.string().optional(),
  image: z.string().nullable().optional(),
  unitPrice: z.number().min(0),
  quantity: z.number().int().min(1).max(99),
  options: z.record(z.string(), z.string()).optional(),
});

const Schema = z.object({
  customer: z.object({
    fullName: z.string().min(3),
    phone: z.string().min(8),
    email: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
  }),
  items: z.array(ItemSchema).min(1),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides. Vérifiez le formulaire." }, { status: 400 });
    }
    const { customer, items, notes } = parsed.data;
    if (!isValidTnPhone(customer.phone)) {
      return NextResponse.json({ error: "Numéro de téléphone invalide (format tunisien)." }, { status: 400 });
    }

    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

    // Mode démo sans DB (preview Vercel sans DATABASE_URL) : simule un numéro
    if (!hasDb() || !prisma) {
      const simulated = `CMD-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
      console.log("[demo] commande simulée", { customer: customer.fullName, subtotal, items: items.length });
      return NextResponse.json({ orderNumber: simulated, demo: true });
    }

    const last = await prisma.order.findFirst({
      orderBy: { createdAt: "desc" },
      select: { orderNumber: true },
    });
    const orderNumber = nextOrderNumber(last?.orderNumber);

    const phone = normalizeTnPhone(customer.phone);

    // Client : recherche par téléphone, sinon création
    let dbCustomer = await prisma.customer.findFirst({ where: { phone } });
    if (!dbCustomer) {
      dbCustomer = await prisma.customer.create({
        data: {
          fullName: customer.fullName.trim(),
          phone,
          email: customer.email?.trim() || null,
          address: customer.address?.trim() || null,
          city: customer.city?.trim() || null,
          postalCode: customer.postalCode?.trim() || null,
        },
      });
    } else {
      await prisma.customer.update({
        where: { id: dbCustomer.id },
        data: {
          fullName: customer.fullName.trim(),
          email: customer.email?.trim() || dbCustomer.email,
          address: customer.address?.trim() || dbCustomer.address,
          city: customer.city?.trim() || dbCustomer.city,
        },
      });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: dbCustomer.id,
        status: "PENDING",
        subtotal,
        total: subtotal,
        currency: "TND",
        notes: notes?.trim() || null,
        items: {
          create: items.map((i) => ({
            productId: i.productId ?? null,
            productName: i.productName,
            productSlug: i.productSlug ?? null,
            image: i.image ?? null,
            unitPrice: i.unitPrice,
            quantity: i.quantity,
            options: i.options ?? {},
            lineTotal: i.unitPrice * i.quantity,
          })),
        },
      },
    });

    return NextResponse.json({ orderNumber: order.orderNumber });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur. Réessayez." }, { status: 500 });
  }
}
