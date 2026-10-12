import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Infrastructure } from "@/models/Infrastructure";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { parseBody } from "@/lib/validate";
import { infrastructureCreateSchema } from "@/lib/validators";

// GET /api/admin-portal/infrastructure
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  await connectDB();
  const collegeId = req.nextUrl.searchParams.get("college");
  const query = collegeId ? { college: collegeId } : {};

  const items = await Infrastructure.find(query)
    .populate("college", "name slug")
    .sort({ createdAt: 1 })
    .lean();

  return NextResponse.json({ data: items });
}

// POST /api/admin-portal/infrastructure
export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const parsed = await parseBody(req, infrastructureCreateSchema);
  if (parsed.error) return parsed.error;

  await connectDB();

  try {
    const item = await Infrastructure.create(parsed.data);
    return NextResponse.json({ data: item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create infrastructure item" }, { status: 500 });
  }
}
