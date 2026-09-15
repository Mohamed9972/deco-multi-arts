import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "dma_admin_session";
const ALG = "HS256";

function secret(): Uint8Array {
  const s =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.AUTH_SECRET ||
    "dev-secret-change-me-32-chars-minimum!!";
  return new TextEncoder().encode(s);
}

export async function createSession(payload: { id: string; email: string; name?: string | null }) {
  const token = await new SignJWT({ ...payload, role: "admin" })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSession(): Promise<{ id: string; email: string; name?: string } | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.email !== "string") return null;
    return {
      id: String(payload.id ?? ""),
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : undefined,
    };
  } catch {
    return null;
  }
}
