import Link from "next/link";
import { connectDB } from "@/lib/db";
import { FeeStructure } from "@/models/FeeStructure";
import "@/models/Course";
import FeeStructureTable from "./FeeStructureTable";

export default async function ManageFeeStructuresPage() {
  await connectDB();
  const fees = await FeeStructure.find()
    .populate("course", "name")
    .sort({ academicYear: -1 })
    .lean();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin-portal" className="text-sm text-slate-500 hover:text-slate-900">
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">Fee Structures</h1>
          <p className="mt-1 text-sm text-slate-500">
            {fees.length} fee structures recorded across courses.
          </p>
        </div>
        <Link
          href="/admin-portal/fee-structures/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add fee structure
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-line bg-white shadow-sm overflow-hidden">
        <FeeStructureTable
          initialFees={fees.map((f: any) => ({
            _id: String(f._id),
            courseName: f.course?.name ?? "Unknown Course",
            academicYear: f.academicYear,
            currency: f.currency,
            tuitionPerYear: f.tuitionPerYear,
            totalCourseFee: f.totalCourseFee,
          }))}
        />
      </div>
    </>
  );
}
