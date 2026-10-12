"use client";

import { useState } from "react";
import Link from "next/link";

type FeeRow = {
  _id: string;
  courseName: string;
  academicYear: string;
  currency: string;
  tuitionPerYear?: number;
  totalCourseFee?: number;
};

export default function FeeStructureTable({
  initialFees,
}: {
  initialFees: FeeRow[];
}) {
  const [fees, setFees] = useState(initialFees);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, courseName: string, year: string) {
    if (!window.confirm(`Delete fee structure for ${courseName} (${year})?`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin-portal/fee-structures/${id}`, { method: "DELETE" });
    if (res.ok) setFees((prev) => prev.filter((f) => f._id !== id));
    setDeletingId(null);
  }

  if (fees.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted">
        No fee structures recorded.{" "}
        <Link href="/admin-portal/fee-structures/new" className="font-semibold text-brand underline">
          Add fee structure
        </Link>
      </div>
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-line bg-slate-50 text-xs font-semibold uppercase text-muted">
        <tr>
          <th className="px-5 py-3">Course</th>
          <th className="px-5 py-3">Academic Year</th>
          <th className="px-5 py-3">Tuition / Year</th>
          <th className="px-5 py-3">Total Fee</th>
          <th className="px-5 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {fees.map((fee) => (
          <tr key={fee._id} className="hover:bg-slate-50">
            <td className="px-5 py-4 font-medium text-ink">{fee.courseName}</td>
            <td className="px-5 py-4 text-muted">{fee.academicYear}</td>
            <td className="px-5 py-4 text-muted">
              {fee.tuitionPerYear ? `${fee.currency} ${fee.tuitionPerYear.toLocaleString()}` : "—"}
            </td>
            <td className="px-5 py-4 text-muted">
              {fee.totalCourseFee ? `${fee.currency} ${fee.totalCourseFee.toLocaleString()}` : "—"}
            </td>
            <td className="px-5 py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/admin-portal/fee-structures/${fee._id}/edit`}
                  className="rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(fee._id, fee.courseName, fee.academicYear)}
                  disabled={deletingId === fee._id}
                  className="rounded bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  {deletingId === fee._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
