import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { parseBody } from "@/lib/validate";
import { courseCreateSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const parsed = await parseBody(req, courseCreateSchema);
  if (parsed.error) return parsed.error;

  await connectDB();

  try {
    const course = await Course.create(parsed.data);
    return NextResponse.json(
      { data: { _id: course._id, name: course.name, slug: course.slug } },
      { status: 201 }
    );
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "This course slug already exists for this college", issues: [{ path: "slug", message: "Already exists" }] },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
