"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type FeeStructureData = {
  _id: string;
  academicYear: string;
  tuitionPerYear?: number;
  totalCourseFee?: number;
  notes?: string;
};

const INPUT =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-slate-900";

export default function FeeStructureEditForm({
  feeStructure,
}: {
  feeStructure: FeeStructureData;
}) {
  const router = useRouter();
  const [academicYear, setAcademicYear] = useState(feeStructure.academicYear);
  const [tuitionPerYear, setTuitionPerYear] = useState(
    feeStructure.tuitionPerYear ? String(feeStructure.tuitionPerYear) : ""
  );
  const [totalCourseFee, setTotalCourseFee] = useState(
    feeStructure.totalCourseFee ? String(feeStructure.totalCourseFee) : ""
  );
  const [notes, setNotes] = useState(feeStructure.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`/api/admin-portal/fee-structures/${feeStructure._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          academicYear,
          tuitionPerYear: tuitionPerYear ? Number(tuitionPerYear) : undefined,
          totalCourseFee: totalCourseFee ? Number(totalCourseFee) : undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update fee structure");
      } else {
        setSuccess(true);
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-line bg-white p-6 shadow-sm">
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          Fee structure updated successfully!{" "}
          <Link href="/admin-portal/fee-structures" className="font-semibold underline">
            Back to fee structures
          </Link>
        </div>
      )}
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div>
        <label className="block text-xs font-semibold text-slate-700">Academic Year</label>
        <input
          required
          placeholder="e.g. 2026-27"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          className={`mt-1 ${INPUT}`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Tuition / Year (INR)</label>
          <input
            type="number"
            min={0}
            value={tuitionPerYear}
            onChange={(e) => setTuitionPerYear(e.target.value)}
            className={`mt-1 ${INPUT}`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700">Total Course Fee (INR)</label>
          <input
            type="number"
            min={0}
            value={totalCourseFee}
            onChange={(e) => setTotalCourseFee(e.target.value)}
            className={`mt-1 ${INPUT}`}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700">Fee Breakdown / Notes</label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={`mt-1 ${INPUT}`}
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <Link
          href="/admin-portal/fee-structures"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
