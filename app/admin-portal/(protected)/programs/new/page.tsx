import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import "@/models/College";
import ProgramForm from "./ProgramForm";

export default async function NewProgramPage() {
  await connectDB();
  const courses = await Course.find()
    .populate("college", "name")
    .sort({ name: 1 })
    .lean();

  return (
    <>
      <Link href="/admin-portal/programs" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to programs
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">Add Program / Branch</h1>
      <p className="mt-1 text-sm text-slate-500">
        Add a degree specialization or branch under a course.
      </p>

      <div className="mt-6 max-w-2xl">
        {courses.length === 0 ? (
          <div className="rounded-xl border border-line bg-white p-6 text-sm text-muted">
            Please{" "}
            <Link href="/admin-portal/courses/new" className="font-semibold text-brand underline">
              add a course first
            </Link>{" "}
            before adding programs.
          </div>
        ) : (
          <ProgramForm
            courses={courses.map((c: any) => ({
              _id: String(c._id),
              name: `${c.name} (${c.college?.name ?? "Unknown College"})`,
            }))}
          />
        )}
      </div>
    </>
  );
}
