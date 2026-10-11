import Link from "next/link";
import { connectDB } from "@/lib/db";
import { College } from "@/models/College";

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
        {colleges.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">
            No colleges created yet.{" "}
            <Link href="/admin-portal/colleges/new" className="font-semibold text-brand underline">
              Create your first college
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-slate-50 text-xs font-semibold uppercase text-muted">
              <tr>
                <th className="px-5 py-3">College Name</th>
                <th className="px-5 py-3">City / State</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {colleges.map((c) => (
                <tr key={String(c._id)} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-ink">{c.name}</td>
                  <td className="px-5 py-4 text-muted">
                    {c.city}{c.state ? `, ${c.state}` : ""}
                  </td>
                  <td className="px-5 py-4 capitalize text-muted">{c.instituteType}</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/colleges/${c.slug}`}
                      target="_blank"
                      className="text-xs font-semibold text-brand hover:underline"
                    >
                      View live →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
