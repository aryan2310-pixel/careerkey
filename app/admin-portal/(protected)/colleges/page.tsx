import Link from "next/link";
import { connectDB } from "@/lib/db";
import { College } from "@/models/College";
import CollegeTable from "./CollegeTable";

export default async function ManageCollegesPage() {
  await connectDB();
  const colleges = await College.find().sort({ createdAt: -1 }).lean();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin-portal" className="text-sm text-slate-500 hover:text-slate-900">
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">Manage Colleges</h1>
          <p className="mt-1 text-sm text-slate-500">
            {colleges.length} {colleges.length === 1 ? "college" : "colleges"} in database.
          </p>
        </div>

        <Link
          href="/admin-portal/colleges/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add college
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-line bg-white shadow-sm overflow-hidden">
        <CollegeTable
          initialColleges={colleges.map((c) => ({
            _id: String(c._id),
            name: c.name,
            slug: c.slug,
            city: c.city,
            state: c.state,
            instituteType: c.instituteType,
          }))}
        />
      </div>
    </>
  );
}
