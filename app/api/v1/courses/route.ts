import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { College } from "@/models/College";
import { parseQuery } from "@/lib/validate";
import { collegeQuerySchema } from "@/lib/validators";

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function GET(req: NextRequest) {
  const parsed = parseQuery(req.nextUrl.searchParams, collegeQuerySchema);
  if (parsed.error) return parsed.error;
  const { city, type, page, limit } = parsed.data;

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (city) filter.city = new RegExp(`^${escapeRegex(city)}$`, "i");
  if (type) filter.instituteType = type;

  const [data, total] = await Promise.all([
    College.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    College.countDocuments(filter),
  ]);

  return NextResponse.json({
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}