import Link from "next/link";
import { connectDB } from "@/lib/db";
import { College } from "@/models/College";
import CourseForm from "./CourseForm";

export default async function NewCoursePage() {
  await connectDB();
  const colleges = await College.find().select("name slug").sort({ name: 1 }).lean();

  return (
    <>
      <Link href="/admin-portal" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to dashboard
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">Add Course to College</h1>
      <p className="mt-1 text-sm text-slate-500">
        Select a college and define its course offerings.
      </p>

      <div className="mt-6 max-w-2xl">
        {colleges.length === 0 ? (
          <div className="rounded-xl border border-line bg-white p-6 text-sm text-muted">
            Please{" "}
            <Link href="/admin-portal/colleges/new" className="font-semibold text-brand underline">
              add a college first
            </Link>{" "}
            before adding courses.
          </div>
        ) : (
          <CourseForm colleges={colleges.map((c) => ({ _id: String(c._id), name: c.name }))} />
        )}
      </div>
    </>
  );
}
