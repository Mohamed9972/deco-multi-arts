import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma, hasDb } from "@/lib/db";
import { createSession } from "@/lib/auth";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Email ou mot de passe invalide." }, { status: 400 });
    const { email, password } = parsed.data;

    // Mode démo sans DB : compte admin/admin123 si ADMIN_EMAIL non configuré
    if (!hasDb() || !prisma) {
      const demoEmail = process.env.ADMIN_EMAIL || "admin@deco-multi-arts.tn";
      const demoPass = process.env.ADMIN_PASSWORD || "admin123";
      if (email.toLowerCase() === demoEmail.toLowerCase() && password === demoPass) {
        await createSession({ id: "demo", email: demoEmail, name: "Admin démo" });
        return NextResponse.json({ ok: true, demo: true });
      }
      return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
    }

    const user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !user.active) {
      return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });

    await createSession({ id: user.id, email: user.email, name: user.name });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
