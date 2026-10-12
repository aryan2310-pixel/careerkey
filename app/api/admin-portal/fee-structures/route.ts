import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { FeeStructure } from "@/models/FeeStructure";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { parseBody } from "@/lib/validate";
import { feeStructureCreateSchema } from "@/lib/validators";

// GET /api/admin-portal/fee-structures
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  await connectDB();
  const courseId = req.nextUrl.searchParams.get("course");
  const query = courseId ? { course: courseId } : {};

  const fees = await FeeStructure.find(query)
    .populate("course", "name slug")
    .sort({ academicYear: -1 })
    .lean();

  return NextResponse.json({ data: fees });
}

// POST /api/admin-portal/fee-structures
export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const parsed = await parseBody(req, feeStructureCreateSchema);
  if (parsed.error) return parsed.error;

  await connectDB();

  try {
    const fee = await FeeStructure.create(parsed.data);
    return NextResponse.json({ data: fee }, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "Fee structure for this course and year already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create fee structure" }, { status: 500 });
  }
}
