import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { requireAdmin, unauthorized } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

const statusSchema = z.object({
  status: z.enum(["new", "contacted", "enrolled", "closed"]),
});

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = statusSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
  }

  await connectDB();
  const lead = await Lead.findByIdAndUpdate(
    id,
    { $set: { status: result.data.status } },
    { new: true }
  ).lean();

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ data: lead });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
  }

  await connectDB();
  await Lead.findByIdAndDelete(id);

  return NextResponse.json({ message: "Lead deleted successfully", id });
}
