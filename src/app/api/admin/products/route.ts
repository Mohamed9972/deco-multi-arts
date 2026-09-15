import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, hasDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/format";

async function guard() {
  return !!(await getSession());
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  if (!hasDb() || !prisma) return NextResponse.json({ products: [], demo: true });
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
    take: 200,
  });
  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      description: p.description,
      price: p.price ? Number(p.price) : null,
      productType: p.productType,
      available: p.available,
      featured: p.featured,
      category: p.category?.name ?? null,
      categoryId: p.categoryId,
      material: p.material,
      colors: p.colors,
      specifications: p.specifications,
      dimensions: p.dimensions,
      coverImage: p.coverImage ?? p.images[0]?.url ?? null,
      images: p.images.map((i) => i.url),
      createdAt: p.createdAt,
    })),
  });
}

const Schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  price: z.number().nullable().optional(),
  productType: z.enum(["DIRECT", "ON_REQUEST", "QUOTATION"]).optional(),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
  categoryId: z.string().nullable().optional(),
  material: z.string().optional(),
  colors: z.array(z.string()).optional(),
  specifications: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  images: z.array(z.string()).optional(),
  dimensions: z.record(z.string(), z.string()).optional(),
});

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  if (!hasDb() || !prisma) return NextResponse.json({ error: "Base non configurée." }, { status: 503 });
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  const d = parsed.data;
  const slug = d.slug?.trim() ? slugify(d.slug) : slugify(d.name);

  if (d.id) {
    const updated = await prisma.product.update({
      where: { id: d.id },
      data: {
        name: d.name,
        slug,
        shortDescription: d.shortDescription || null,
        description: d.description || null,
        price: d.price ?? null,
        productType: (d.productType ?? "DIRECT") as never,
        available: d.available ?? true,
        featured: d.featured ?? false,
        categoryId: d.categoryId || null,
        material: d.material || null,
        colors: d.colors ?? [],
        specifications: d.specifications ?? [],
        coverImage: d.coverImage || null,
        dimensions: d.dimensions ?? undefined,
      },
    });
    if (d.images) {
      await prisma.productImage.deleteMany({ where: { productId: updated.id } });
      if (d.images.length > 0) {
        await prisma.productImage.createMany({
          data: d.images.filter(Boolean).map((url, i) => ({ productId: updated.id, url, sortOrder: i })),
        });
      }
    }
    return NextResponse.json({ ok: true, id: updated.id });
  }

  const created = await prisma.product.create({
    data: {
      name: d.name,
      slug,
      shortDescription: d.shortDescription || null,
      description: d.description || null,
      price: d.price ?? null,
      productType: (d.productType ?? "DIRECT") as never,
      available: d.available ?? true,
      featured: d.featured ?? false,
      categoryId: d.categoryId || null,
      material: d.material || null,
      colors: d.colors ?? [],
      specifications: d.specifications ?? [],
      coverImage: d.coverImage || d.images?.[0] || null,
      dimensions: d.dimensions ?? undefined,
      images: d.images?.length
        ? { create: d.images.filter(Boolean).map((url, i) => ({ url, sortOrder: i })) }
        : undefined,
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
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
