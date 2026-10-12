import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Program } from "@/models/Program";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { parseBody } from "@/lib/validate";
import { programCreateSchema } from "@/lib/validators";

// GET /api/admin-portal/programs
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  await connectDB();
  const courseId = req.nextUrl.searchParams.get("course");
  const query = courseId ? { course: courseId } : {};

  const programs = await Program.find(query)
    .populate("course", "name slug")
    .sort({ name: 1 })
    .lean();

  return NextResponse.json({ data: programs });
}

// POST /api/admin-portal/programs
export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const parsed = await parseBody(req, programCreateSchema);
  if (parsed.error) return parsed.error;

  await connectDB();

  try {
    const program = await Program.create(parsed.data);
    return NextResponse.json(
      { data: { _id: program._id, name: program.name, slug: program.slug } },
      { status: 201 }
    );
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "This program slug already exists for this course", issues: [{ path: "slug", message: "Already exists" }] },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create program" }, { status: 500 });
  }
}
