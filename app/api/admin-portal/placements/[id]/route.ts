import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { Placement } from "@/models/Placement";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { parseBody } from "@/lib/validate";
import { placementUpdateSchema } from "@/lib/validators";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid placement ID" }, { status: 400 });

  await connectDB();
  const placement = await Placement.findById(id).lean();
  if (!placement) return NextResponse.json({ error: "Placement not found" }, { status: 404 });

  return NextResponse.json({ data: placement });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid placement ID" }, { status: 400 });

  const parsed = await parseBody(req, placementUpdateSchema);
  if (parsed.error) return parsed.error;

  await connectDB();
  const placement = await Placement.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
  if (!placement) return NextResponse.json({ error: "Placement not found" }, { status: 404 });

  return NextResponse.json({ data: placement });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid placement ID" }, { status: 400 });

  await connectDB();
  await Placement.findByIdAndDelete(id);
  return NextResponse.json({ message: "Placement deleted successfully", id });
}
