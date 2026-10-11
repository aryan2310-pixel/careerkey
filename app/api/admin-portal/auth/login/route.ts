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

// compared against when the email doesn't exist, so response time doesn't reveal valid emails
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

export async function POST(req: NextRequest) {
  const parsed = await parseBody(req, loginSchema);
  if (parsed.error) return parsed.error;
  const { email, password } = parsed.data;

  await connectDB();

  const admin = await Admin.findOne({ email }).select("+passwordHash");
  const valid = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);

  if (!admin || !valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await signToken({
    sub: String(admin._id),
    name: admin.name,
    role: admin.role,
  });

  const res = NextResponse.json({ data: { name: admin.name, email: admin.email } });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true, // JavaScript on the page can't read it
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}