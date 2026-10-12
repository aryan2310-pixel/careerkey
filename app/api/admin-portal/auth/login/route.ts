import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { signToken, COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/jwt";
import { parseBody } from "@/lib/validate";

const loginSchema = z
  .object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1).max(200),
  })
  .strict();

// Compared against when the email doesn't exist, so response time doesn't reveal valid emails
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

// --- IP-based Rate Limiter (1 attempt per 10 seconds) ---
const RATE_LIMIT_WINDOW_MS = 10_000; // 10 seconds
const ipAttempts = new Map<string, number>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return req.ip || "127.0.0.1";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const lastAttempt = ipAttempts.get(ip);

  // Periodically clean up expired entries to keep memory bounded
  if (ipAttempts.size > 500) {
    for (const [key, timestamp] of ipAttempts.entries()) {
      if (now - timestamp > RATE_LIMIT_WINDOW_MS) {
        ipAttempts.delete(key);
      }
    }
  }

  if (lastAttempt && now - lastAttempt < RATE_LIMIT_WINDOW_MS) {
    return false; // Rate limited
  }

  ipAttempts.set(ip, now);
  return true; // Allowed
}

export async function POST(req: NextRequest) {
  // 1. Check IP rate limit before doing any database or bcrypt work
  const clientIp = getClientIp(req);
  if (!checkRateLimit(clientIp)) {
    const res = NextResponse.json(
      { error: "Too many login attempts. Please wait 10 seconds before trying again." },
      { status: 429 }
    );
    res.headers.set("Retry-After", "10");
    return res;
  }

  // 2. Validate request payload
  const parsed = await parseBody(req, loginSchema);
  if (parsed.error) return parsed.error;
  const { email, password } = parsed.data;

  // 3. Authenticate admin
  await connectDB();

  const admin = await Admin.findOne({ email }).select("+passwordHash");
  const valid = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);

  if (!admin || !valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  // 4. Issue session token
  const token = await signToken({
    sub: String(admin._id),
    name: admin.name,
    role: admin.role,
  });

  const res = NextResponse.json({ data: { name: admin.name, email: admin.email } });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}