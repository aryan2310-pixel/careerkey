import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import CourseEditForm from "./CourseEditForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditCoursePage({ params }: Props) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  await connectDB();
  const course = await Course.findById(id).lean();
  if (!course) notFound();

  return (
    <>
      <Link href="/admin-portal/courses" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to courses
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">Edit Course</h1>
      <p className="mt-1 text-sm text-slate-500">Update course duration, level, or criteria.</p>

      <div className="mt-6 max-w-2xl">
        <CourseEditForm
          course={{
            _id: String(course._id),
            name: course.name,
            slug: course.slug,
            level: course.level,
            durationYears: course.durationYears,
            eligibility: course.eligibility,
          }}
        />
      </div>
    </>
  );
}
