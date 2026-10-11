import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import "@/models/College";
import { parseQuery } from "@/lib/validate";
import { courseQuerySchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const parsed = parseQuery(req.nextUrl.searchParams, courseQuerySchema);
  if (parsed.error) return parsed.error;

  const { level, name, college, page, limit } = parsed.data;

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (level) filter.level = level;
  if (college) filter.college = college;
  if (name) filter.name = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const [data, total] = await Promise.all([
    Course.find(filter)
      .populate("college", "name slug city state image instituteType")
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Course.countDocuments(filter),
  ]);

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}