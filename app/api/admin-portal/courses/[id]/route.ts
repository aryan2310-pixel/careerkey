import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { Program } from "@/models/Program";
import { FeeStructure } from "@/models/FeeStructure";
import { Placement } from "@/models/Placement";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { parseBody } from "@/lib/validate";
import { courseUpdateSchema } from "@/lib/validators";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });

  await connectDB();
  const course = await Course.findById(id).lean();
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  return NextResponse.json({ data: course });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });

  const parsed = await parseBody(req, courseUpdateSchema);
  if (parsed.error) return parsed.error;

  await connectDB();
  try {
    const course = await Course.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json({ data: course });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ error: "Course slug already exists for this college" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });

  await connectDB();
  const programs = await Program.find({ course: id }).select("_id").lean();
  const programIds = programs.map((p) => p._id);

  await Promise.all([
    Course.findByIdAndDelete(id),
    FeeStructure.deleteMany({ course: id }),
    Program.deleteMany({ course: id }),
    Placement.deleteMany({ program: { $in: programIds } }),
  ]);

  return NextResponse.json({ message: "Course deleted successfully", id });
}
