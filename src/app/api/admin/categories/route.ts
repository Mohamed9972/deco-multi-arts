import { NextResponse } from "next/server";
import { prisma, hasDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/format";

async function guard() {
  return !!(await getSession());
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  if (!hasDb() || !prisma) return NextResponse.json({ categories: [], demo: true });
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  if (!hasDb() || !prisma) return NextResponse.json({ error: "Base non configurée." }, { status: 503 });
  const body = await req.json();
  const { id, name, description, image, active, featured } = body as Record<string, string | boolean | undefined>;
  if (!name || String(name).trim().length < 2) return NextResponse.json({ error: "Nom requis." }, { status: 400 });
  const slug = slugify(String(name));
  if (id) {
    const updated = await prisma.category.update({
      where: { id: String(id) },
      data: {
        name: String(name),
        description: (description as string) || null,
        image: (image as string) || null,
        active: active !== false,
        featured: !!featured,
      },
    });
    return NextResponse.json({ ok: true, id: updated.id });
  }
  const created = await prisma.category.create({
    data: {
      name: String(name),
      slug,
      description: (description as string) || null,
      image: (image as string) || null,
      active: true,
      featured: !!featured,
    },
  });
  return NextResponse.json({ ok: true, id: created.id });
}

export async function DELETE(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  if (!hasDb() || !prisma) return NextResponse.json({ error: "Base non configurée." }, { status: 503 });
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID manquant." }, { status: 400 });
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
