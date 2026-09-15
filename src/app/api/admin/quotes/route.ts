import { NextResponse } from "next/server";
import { prisma, hasDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function guard() {
  return !!(await getSession());
}

export async function GET(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  if (!hasDb() || !prisma) return NextResponse.json({ quotes: [], demo: true });
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const quotes = await prisma.quoteRequest.findMany({
    where: status ? { status: status as never } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ quotes });
}

export async function PATCH(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  if (!hasDb() || !prisma) return NextResponse.json({ error: "Base non configurée." }, { status: 503 });
  const body = await req.json();
  const { id, status, adminNotes } = body as { id: string; status?: string; adminNotes?: string };
  const allowed = ["NEW", "CONTACTED", "IN_PROGRESS", "SENT", "ACCEPTED", "REJECTED"];
  if (!id) return NextResponse.json({ error: "ID manquant." }, { status: 400 });
  const data: Record<string, unknown> = {};
  if (status) {
    if (!allowed.includes(status)) return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    data.status = status;
  }
  if (typeof adminNotes === "string") data.adminNotes = adminNotes;
  await prisma.quoteRequest.update({ where: { id }, data: data as never });
  return NextResponse.json({ ok: true });
}
