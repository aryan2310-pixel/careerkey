import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { College } from "@/models/College";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { parseBody } from "@/lib/validate";
import { collegeCreateSchema } from "@/lib/validators";

// POST /api/admin/colleges
export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const parsed = await parseBody(req, collegeCreateSchema);
  if (parsed.error) return parsed.error;

  await connectDB();

  try {
    const college = await College.create(parsed.data);
    return NextResponse.json(
      { data: { _id: college._id, name: college.name, slug: college.slug } },
      { status: 201 }
    );
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "A college with this slug already exists", issues: [{ path: "slug", message: "Already taken" }] },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}