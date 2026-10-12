import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { Infrastructure } from "@/models/Infrastructure";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { parseBody } from "@/lib/validate";
import { infrastructureUpdateSchema } from "@/lib/validators";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  await connectDB();
  const item = await Infrastructure.findById(id).lean();
  if (!item) return NextResponse.json({ error: "Infrastructure item not found" }, { status: 404 });

  return NextResponse.json({ data: item });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const parsed = await parseBody(req, infrastructureUpdateSchema);
  if (parsed.error) return parsed.error;

  await connectDB();
  const item = await Infrastructure.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
  if (!item) return NextResponse.json({ error: "Infrastructure item not found" }, { status: 404 });

  return NextResponse.json({ data: item });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  await connectDB();
  await Infrastructure.findByIdAndDelete(id);
  return NextResponse.json({ message: "Infrastructure item deleted successfully", id });
}
