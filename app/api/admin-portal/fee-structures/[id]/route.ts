import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { FeeStructure } from "@/models/FeeStructure";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { parseBody } from "@/lib/validate";
import { feeStructureUpdateSchema } from "@/lib/validators";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  await connectDB();
  const fee = await FeeStructure.findById(id).lean();
  if (!fee) return NextResponse.json({ error: "Fee structure not found" }, { status: 404 });

  return NextResponse.json({ data: fee });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const parsed = await parseBody(req, feeStructureUpdateSchema);
  if (parsed.error) return parsed.error;

  await connectDB();
  try {
    const fee = await FeeStructure.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
    if (!fee) return NextResponse.json({ error: "Fee structure not found" }, { status: 404 });
    return NextResponse.json({ data: fee });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "Fee structure for this course and year already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to update fee structure" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  await connectDB();
  await FeeStructure.findByIdAndDelete(id);
  return NextResponse.json({ message: "Fee structure deleted successfully", id });
}
