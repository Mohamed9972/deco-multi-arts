import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;
  try {
    return new PrismaClient();
  } catch {
    return null;
  }
}

export const prisma: PrismaClient | null =
  globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

export function hasDb(): boolean {
  return !!prisma && !!process.env.DATABASE_URL;
}

export async function getSetting(key: string, fallback = ""): Promise<string> {
  if (!hasDb() || !prisma) return process.env[key] ?? fallback;
  try {
    const s = await prisma.siteSetting.findUnique({ where: { key } });
    return s?.value ?? fallback;
  } catch {
    return fallback;
  }
}
