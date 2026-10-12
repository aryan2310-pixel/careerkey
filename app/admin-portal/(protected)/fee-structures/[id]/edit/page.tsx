import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { FeeStructure } from "@/models/FeeStructure";
import "@/models/Course";
import FeeStructureEditForm from "./FeeStructureEditForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditFeeStructurePage({ params }: Props) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  await connectDB();
  const fee = await FeeStructure.findById(id).populate("course", "name").lean();
  if (!fee) notFound();

  return (
    <>
      <Link href="/admin-portal/fee-structures" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to fee structures
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">Edit Fee Structure</h1>
      <p className="mt-1 text-sm text-slate-500">
        Update tuition and costs for {(fee.course as any)?.name ?? "course"}.
      </p>

      <div className="mt-6 max-w-2xl">
        <FeeStructureEditForm
          feeStructure={{
            _id: String(fee._id),
            academicYear: fee.academicYear,
            tuitionPerYear: fee.tuitionPerYear,
            totalCourseFee: fee.totalCourseFee,
            notes: fee.notes,
          }}
        />
      </div>
    </>
  );
}
