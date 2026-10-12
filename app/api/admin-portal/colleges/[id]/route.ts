import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { College } from "@/models/College";
import { Course } from "@/models/Course";
import { Program } from "@/models/Program";
import { Placement } from "@/models/Placement";
import { FeeStructure } from "@/models/FeeStructure";
import { Infrastructure } from "@/models/Infrastructure";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { parseBody } from "@/lib/validate";
import { collegeUpdateSchema } from "@/lib/validators";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/admin-portal/colleges/:id
export async function GET(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid college ID" }, { status: 400 });
  }

  await connectDB();
  const college = await College.findById(id).lean();
  if (!college) {
    return NextResponse.json({ error: "College not found" }, { status: 404 });
  }

  return NextResponse.json({ data: college });
}

// PATCH /api/admin-portal/colleges/:id
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid college ID" }, { status: 400 });
  }

  const parsed = await parseBody(req, collegeUpdateSchema);
  if (parsed.error) return parsed.error;

  await connectDB();

  try {
    const updated = await College.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "A college with this slug already exists", issues: [{ path: "slug", message: "Already taken" }] },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to update college" }, { status: 500 });
  }
}

// DELETE /api/admin-portal/colleges/:id
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid college ID" }, { status: 400 });
  }

  await connectDB();

  const college = await College.findById(id).lean();
  if (!college) {
    return NextResponse.json({ error: "College not found" }, { status: 404 });
  }

  // Clean up all related child entities in cascade
  const courses = await Course.find({ college: id }).select("_id").lean();
  const courseIds = courses.map((c) => c._id);
  const programs = await Program.find({ course: { $in: courseIds } }).select("_id").lean();
  const programIds = programs.map((p) => p._id);

  await Promise.all([
    College.findByIdAndDelete(id),
    Course.deleteMany({ college: id }),
    Infrastructure.deleteMany({ college: id }),
    FeeStructure.deleteMany({ course: { $in: courseIds } }),
    Program.deleteMany({ course: { $in: courseIds } }),
    Placement.deleteMany({ program: { $in: programIds } }),
  ]);

  return NextResponse.json({ message: "College deleted successfully", id });
}
