import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Insight } from "@/models/Insight";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { parseBody } from "@/lib/validate";
import { insightCreateSchema } from "@/lib/validators";

// GET /api/admin-portal/insights
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  await connectDB();
  const insights = await Insight.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: insights });
}

// POST /api/admin-portal/insights
export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const parsed = await parseBody(req, insightCreateSchema);
  if (parsed.error) return parsed.error;

  await connectDB();

  try {
    const insight = await Insight.create(parsed.data);
    return NextResponse.json(
      { data: { _id: insight._id, title: insight.title, slug: insight.slug } },
      { status: 201 }
    );
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "An insight with this slug already exists", issues: [{ path: "slug", message: "Already exists" }] },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create insight" }, { status: 500 });
  }
}
