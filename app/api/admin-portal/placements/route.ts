import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Placement } from "@/models/Placement";
import { Program } from "@/models/Program";
import { Course } from "@/models/Course";
import { requireAdmin, unauthorized } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const body = await req.json();
  const { courseId, academicYear, highestPackageLPA, averagePackageLPA, studentsEligible, studentsPlaced, topRecruiters } = body;

  if (!courseId || !academicYear) {
    return NextResponse.json({ error: "Course and academic year are required" }, { status: 400 });
  }

  await connectDB();

  // Find or create default program for this course
  let program = await Program.findOne({ course: courseId });
  if (!program) {
    const course = await Course.findById(courseId);
    program = await Program.create({
      course: courseId,
      name: course?.name ?? "General",
      slug: (course?.slug ?? "general") + "-main",
    });
  }

  try {
    const placement = await Placement.create({
      program: program._id,
      academicYear,
      highestPackageLPA: highestPackageLPA ? Number(highestPackageLPA) : undefined,
      averagePackageLPA: averagePackageLPA ? Number(averagePackageLPA) : undefined,
      studentsEligible: studentsEligible ? Number(studentsEligible) : undefined,
      studentsPlaced: studentsPlaced ? Number(studentsPlaced) : undefined,
      topRecruiters: typeof topRecruiters === "string" ? topRecruiters.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
    });

    return NextResponse.json({ data: placement }, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ error: "Placement record for this academic year already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to save placement record" }, { status: 500 });
  }
}
