"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const INPUT =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-slate-900";

export default function FeeStructureForm({
  courses,
}: {
  courses: { _id: string; name: string }[];
}) {
  const router = useRouter();
  const [course, setCourse] = useState(courses[0]?._id ?? "");
  const [academicYear, setAcademicYear] = useState("2026-27");
  const [tuitionPerYear, setTuitionPerYear] = useState("");
  const [totalCourseFee, setTotalCourseFee] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin-portal/fee-structures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course,
          academicYear,
          currency: "INR",
          tuitionPerYear: tuitionPerYear ? Number(tuitionPerYear) : undefined,
          totalCourseFee: totalCourseFee ? Number(totalCourseFee) : undefined,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to create fee structure");
      }

      router.push("/admin-portal/fee-structures");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-line bg-white p-6 shadow-sm">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Select Course</span>
        <select required value={course} onChange={(e) => setCourse(e.target.value)} className={INPUT}>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium">Academic Year</span>
        <input
          required
          placeholder="e.g. 2026-27"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          className={INPUT}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Tuition / Year (INR)</span>
          <input
            type="number"
            min="0"
            placeholder="e.g. 150000"
            value={tuitionPerYear}
            onChange={(e) => setTuitionPerYear(e.target.value)}
            className={INPUT}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Total Course Fee (INR)</span>
          <input
            type="number"
            min="0"
            placeholder="e.g. 600000"
            value={totalCourseFee}
            onChange={(e) => setTotalCourseFee(e.target.value)}
            className={INPUT}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium">Fee Notes / Breakdown (Optional)</span>
        <textarea
          rows={3}
          placeholder="Includes semester exam fees, library deposit, caution money..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={INPUT}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? "Creating..." : "Save Fee Structure"}
      </button>
    </form>
  );
}
