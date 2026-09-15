import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "../src/data/fallback";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL manquant. Configurez Neon puis relancez le seed.");
  process.exit(1);
}

// Connexion directe (runtime Node.js) — pas d'adaptateur serverless requis.
const prisma = new PrismaClient();

async function main() {
  console.log("Seed Déco + Multi-Arts…");

  // Catégories
  for (const [i, c] of FALLBACK_CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, image: c.image, featured: !!c.featured, sortOrder: i },
      create: { name: c.name, slug: c.slug, description: c.description, image: c.image, featured: !!c.featured, sortOrder: i, active: true },
    });
  }

  // Produits
  for (const p of FALLBACK_PRODUCTS) {
    const cat = await prisma.category.findUnique({ where: { slug: p.categorySlug } });
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price !== null ? new Prisma.Decimal(p.price) : null,
        productType: p.productType as never,
        available: p.available,
        featured: p.featured,
        categoryId: cat?.id ?? null,
        material: p.material ?? null,
        colors: p.colors ?? [],
        specifications: p.specifications ?? [],
        coverImage: p.coverImage,
        dimensions: (p.dimensions ?? undefined) as never,
      },
      create: {
        name: p.name,
        slug: p.slug,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price !== null ? new Prisma.Decimal(p.price) : null,
        productType: p.productType as never,
        available: p.available,
        featured: p.featured,
        categoryId: cat?.id ?? null,
        material: p.material ?? null,
        colors: p.colors ?? [],
        specifications: p.specifications ?? [],
        coverImage: p.coverImage,
        dimensions: (p.dimensions ?? undefined) as never,
        images: { create: p.images.map((img, i) => ({ url: img, sortOrder: i })) },
      },
    });
    // complète la galerie si manquante
    const existing = await prisma.product.findUnique({ where: { slug: p.slug }, include: { images: true } });
    if (existing && existing.images.length === 0 && p.images.length > 0) {
      await prisma.productImage.createMany({
        data: p.images.map((img, i) => ({ productId: existing.id, url: img, sortOrder: i })),
      });
    }
  }

  // Admin
  const email = (process.env.ADMIN_EMAIL || "admin@deco-multi-arts.tn").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const hash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash: hash, active: true, name: "Administrateur" },
    create: { email, passwordHash: hash, name: "Administrateur", role: "admin", active: true },
  });

  // Réglages site
  await prisma.siteSetting.upsert({
    where: { key: "NEXT_PUBLIC_WHATSAPP_NUMBER" },
    update: {},
    create: { key: "NEXT_PUBLIC_WHATSAPP_NUMBER", value: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "21600000000" },
  });

  console.log(`OK — ${FALLBACK_CATEGORIES.length} catégories, ${FALLBACK_PRODUCTS.length} produits, admin ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
