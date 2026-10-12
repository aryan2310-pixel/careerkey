import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import "@/models/College";
import CourseTable from "./CourseTable";

export default async function ManageCoursesPage() {
  await connectDB();
  const courses = await Course.find()
    .populate("college", "name")
    .sort({ name: 1 })
    .lean();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin-portal" className="text-sm text-slate-500 hover:text-slate-900">
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">Manage Courses</h1>
          <p className="mt-1 text-sm text-slate-500">{courses.length} courses across colleges.</p>
        </div>
        <Link
          href="/admin-portal/courses/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add course
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-line bg-white shadow-sm overflow-hidden">
        <CourseTable
          initialCourses={courses.map((c: any) => ({
            _id: String(c._id),
            name: c.name,
            slug: c.slug,
            collegeName: c.college?.name ?? "Unknown College",
            durationYears: c.durationYears,
            level: c.level,
          }))}
        />
      </div>
    </>
  );
}
