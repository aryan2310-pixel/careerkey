import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "admin_token";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export type AdminSession = { sub: string; name: string; role: string };

function getKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set in .env.local (32+ characters)");
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(session: AdminSession) {
  return new SignJWT({ name: session.name, role: session.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getKey());
}

export async function verifyToken(token?: string): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      name: String(payload.name ?? ""),
      role: String(payload.role ?? "admin"),
    };
  } catch {
    return null; // expired, tampered, or malformed
  }
}