import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { requireAdmin, unauthorized } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  await connectDB();
  const leads = await Lead.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: leads });
}
