import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, hasDb } from "@/lib/db";
import { nextQuoteNumber, normalizeTnPhone, isValidTnPhone } from "@/lib/format";

const Schema = z.object({
  fullName: z.string().min(3),
  phone: z.string().min(8),
  email: z.string().optional(),
  company: z.string().optional(),
  city: z.string().optional(),
  projectType: z.string().optional(),
  productName: z.string().optional(),
  quantity: z.number().int().min(1).optional(),
  dimensions: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
});

const PROJECTS = ["VILLA", "HOTEL", "PISCINE", "TERRASSE", "JARDIN", "RESTAURANT", "RESIDENCE", "PROFESSIONNEL", "AUTRE"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }
    const d = parsed.data;
    if (!isValidTnPhone(d.phone)) {
      return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
    }
    if (!hasDb() || !prisma) {
      const simulated = `DEV-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
      console.log("[demo] devis simulé", d.fullName);
      return NextResponse.json({ quoteNumber: simulated, demo: true });
    }
    const last = await prisma.quoteRequest.findFirst({
      orderBy: { createdAt: "desc" },
      select: { quoteNumber: true },
    });
    const quoteNumber = nextQuoteNumber(last?.quoteNumber);
    const phone = normalizeTnPhone(d.phone);
    const projectType = PROJECTS.includes((d.projectType ?? "").toUpperCase())
      ? ((d.projectType ?? "VILLA").toUpperCase() as "VILLA")
      : ("VILLA" as const);

    const quote = await prisma.quoteRequest.create({
      data: {
        quoteNumber,
        status: "NEW",
        fullName: d.fullName.trim(),
        phone,
        email: d.email?.trim() || null,
        company: d.company?.trim() || null,
        city: d.city?.trim() || null,
        projectType: projectType as never,
        productName: d.productName?.trim() || null,
        quantity: d.quantity ?? 1,
        dimensions: d.dimensions?.trim() || null,
        budget: d.budget?.trim() || null,
        message: d.message?.trim() || null,
      },
    });
    return NextResponse.json({ quoteNumber: quote.quoteNumber });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
