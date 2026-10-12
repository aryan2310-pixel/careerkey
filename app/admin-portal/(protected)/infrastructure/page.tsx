import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Infrastructure } from "@/models/Infrastructure";
import "@/models/College";
import InfrastructureTable from "./InfrastructureTable";

export default async function ManageInfrastructurePage() {
  await connectDB();
  const items = await Infrastructure.find()
    .populate("college", "name")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin-portal" className="text-sm text-slate-500 hover:text-slate-900">
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">Campus & Infrastructure</h1>
          <p className="mt-1 text-sm text-slate-500">
            {items.length} campus facilities recorded.
          </p>
        </div>
        <Link
          href="/admin-portal/infrastructure/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add facility
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-line bg-white shadow-sm overflow-hidden">
        <InfrastructureTable
          initialItems={items.map((i: any) => ({
            _id: String(i._id),
            collegeName: i.college?.name ?? "Unknown College",
            title: i.title,
            description: i.description,
          }))}
        />
      </div>
    </>
  );
}
