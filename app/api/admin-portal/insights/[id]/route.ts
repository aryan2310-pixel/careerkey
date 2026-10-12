import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { Insight } from "@/models/Insight";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { parseBody } from "@/lib/validate";
import { insightUpdateSchema } from "@/lib/validators";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  await connectDB();
  const insight = await Insight.findById(id).lean();
  if (!insight) return NextResponse.json({ error: "Insight not found" }, { status: 404 });

  return NextResponse.json({ data: insight });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const parsed = await parseBody(req, insightUpdateSchema);
  if (parsed.error) return parsed.error;

  await connectDB();
  try {
    const insight = await Insight.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
    if (!insight) return NextResponse.json({ error: "Insight not found" }, { status: 404 });
    return NextResponse.json({ data: insight });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update insight" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  await connectDB();
  await Insight.findByIdAndDelete(id);
  return NextResponse.json({ message: "Insight deleted successfully", id });
}
