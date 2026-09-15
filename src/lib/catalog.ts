import { prisma, hasDb } from "./db";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "@/data/fallback";

export type CatalogCategory = {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  description: string | null;
  descriptionAr: string | null;
  image: string | null;
  featured: boolean;
};

export type CatalogProduct = {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  shortDescription: string | null;
  shortDescriptionAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  price: number | null;
  currency: string;
  productType: "DIRECT" | "ON_REQUEST" | "QUOTATION";
  available: boolean;
  featured: boolean;
  categorySlug: string | null;
  categoryName: string | null;
  categoryNameAr: string | null;
  material: string | null;
  dimensions: Record<string, string> | null;
  colors: string[];
  specifications: string[];
  options: { name: string; values: string[] }[] | null;
  images: string[];
  coverImage: string | null;
};

function toNumber(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  // Prisma Decimal
  if (typeof v === "object" && v !== null && "toString" in v) {
    const n = parseFloat((v as { toString(): string }).toString());
    return Number.isNaN(n) ? null : n;
  }
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

export async function getCategories(): Promise<CatalogCategory[]> {
  if (hasDb() && prisma) {
    try {
      const rows = await prisma.category.findMany({
        where: { active: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      });
      return rows.map((c) => ({
        id: c.id,
        name: c.name,
        nameAr: null,
        slug: c.slug,
        description: c.description,
        descriptionAr: null,
        image: c.image,
        featured: c.featured,
      }));
    } catch {
      // fallback ci-dessous
    }
  }
  return FALLBACK_CATEGORIES.map((c) => ({
    id: c.id,
    name: c.name,
    nameAr: c.nameAr,
    slug: c.slug,
    description: c.description,
    descriptionAr: c.descriptionAr,
    image: c.image,
    featured: !!c.featured,
  }));
}

export async function getProducts(opts?: {
  featured?: boolean;
  category?: string;
  search?: string;
}): Promise<CatalogProduct[]> {
  if (hasDb() && prisma) {
    try {
      const rows = await prisma.product.findMany({
        include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      });
      let list: CatalogProduct[] = rows.map((p) => ({
        id: p.id,
        name: p.name,
        nameAr: null,
        slug: p.slug,
        shortDescription: p.shortDescription,
        shortDescriptionAr: null,
        description: p.description,
        descriptionAr: null,
        price: toNumber(p.price),
        currency: p.currency,
        productType: p.productType as CatalogProduct["productType"],
        available: p.available,
        featured: p.featured,
        categorySlug: p.category?.slug ?? null,
        categoryName: p.category?.name ?? null,
        categoryNameAr: null,
        material: p.material,
        dimensions: (p.dimensions as Record<string, string> | null) ?? null,
        colors: p.colors,
        specifications: p.specifications,
        options: (p.options as CatalogProduct["options"]) ?? null,
        images:
          p.images.length > 0
            ? p.images.map((i) => i.url)
            : p.coverImage
              ? [p.coverImage]
              : [],
        coverImage: p.coverImage ?? p.images[0]?.url ?? null,
      }));
      if (opts?.featured) list = list.filter((p) => p.featured);
      if (opts?.category) list = list.filter((p) => p.categorySlug === opts.category);
      if (opts?.search) {
        const q = opts.search.toLowerCase();
        list = list.filter((p) =>
          `${p.name} ${p.nameAr ?? ""} ${p.shortDescription ?? ""} ${p.shortDescriptionAr ?? ""} ${p.description ?? ""}`.toLowerCase().includes(q),
        );
      }
      return list;
    } catch {
      // fallback
    }
  }
  let list: CatalogProduct[] = FALLBACK_PRODUCTS.map((p) => {
    const cat = FALLBACK_CATEGORIES.find((c) => c.slug === p.categorySlug);
    return {
      id: p.id,
      name: p.name,
      nameAr: p.nameAr,
      slug: p.slug,
      shortDescription: p.shortDescription,
      shortDescriptionAr: p.shortDescriptionAr,
      description: p.description,
      descriptionAr: p.descriptionAr,
      price: p.price,
      currency: p.currency,
      productType: p.productType,
      available: p.available,
      featured: p.featured,
      categorySlug: p.categorySlug,
      categoryName: cat?.name ?? null,
      categoryNameAr: cat?.nameAr ?? null,
      material: p.material ?? null,
      dimensions: p.dimensions ?? null,
      colors: p.colors ?? [],
      specifications: p.specifications ?? [],
      options: p.options ?? null,
      images: p.images,
      coverImage: p.coverImage,
    };
  });
  if (opts?.featured) list = list.filter((p) => p.featured);
  if (opts?.category) list = list.filter((p) => p.categorySlug === opts.category);
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    list = list.filter((p) =>
      `${p.name} ${p.nameAr ?? ""} ${p.shortDescription ?? ""} ${p.shortDescriptionAr ?? ""}`.toLowerCase().includes(q),
    );
  }
  return list;
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}
