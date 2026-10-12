import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { Program } from "@/models/Program";
import { Placement } from "@/models/Placement";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { parseBody } from "@/lib/validate";
import { programUpdateSchema } from "@/lib/validators";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid program ID" }, { status: 400 });

  await connectDB();
  const program = await Program.findById(id).lean();
  if (!program) return NextResponse.json({ error: "Program not found" }, { status: 404 });

  return NextResponse.json({ data: program });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid program ID" }, { status: 400 });

  const parsed = await parseBody(req, programUpdateSchema);
  if (parsed.error) return parsed.error;

  await connectDB();
  try {
    const program = await Program.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
    if (!program) return NextResponse.json({ error: "Program not found" }, { status: 404 });
    return NextResponse.json({ data: program });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ error: "Program slug already exists for this course" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update program" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid program ID" }, { status: 400 });

  await connectDB();
  await Promise.all([
    Program.findByIdAndDelete(id),
    Placement.deleteMany({ program: id }),
  ]);

  return NextResponse.json({ message: "Program deleted successfully", id });
}
