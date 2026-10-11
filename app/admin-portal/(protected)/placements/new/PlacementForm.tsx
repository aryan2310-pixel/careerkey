"use client";

import { useState } from "react";

export default function PlacementForm({
  courses,
}: {
  courses: { _id: string; name: string; collegeName: string }[];
}) {
  const [courseId, setCourseId] = useState(courses[0]?._id ?? "");
  const [academicYear, setAcademicYear] = useState("2024-25");
  const [highest, setHighest] = useState("");
  const [average, setAverage] = useState("");
  const [placed, setPlaced] = useState("");
  const [eligible, setEligible] = useState("");
  const [recruiters, setRecruiters] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin-portal/placements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          academicYear,
          highestPackageLPA: highest || undefined,
          averagePackageLPA: average || undefined,
          studentsPlaced: placed || undefined,
          studentsEligible: eligible || undefined,
          topRecruiters: recruiters,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to record placements");
      } else {
        setMsg(`Placement stats for ${academicYear} recorded successfully!`);
        setHighest("");
        setAverage("");
        setPlaced("");
        setEligible("");
        setRecruiters("");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-slate-900";

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-line bg-white p-6 shadow-sm">
      {msg && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{msg}</p>}
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div>
        <label className="block text-xs font-semibold text-slate-700">Course & College</label>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
          className={`mt-1 ${inputClass}`}
        >
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} — {c.collegeName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700">Academic Year</label>
        <input
          required
          placeholder="2024-25"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          className={`mt-1 ${inputClass}`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Highest Package (LPA)</label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 42.5"
            value={highest}
            onChange={(e) => setHighest(e.target.value)}
            className={`mt-1 ${inputClass}`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700">Average Package (LPA)</label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 8.2"
            value={average}
            onChange={(e) => setAverage(e.target.value)}
            className={`mt-1 ${inputClass}`}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Students Eligible</label>
          <input
            type="number"
            placeholder="e.g. 180"
            value={eligible}
            onChange={(e) => setEligible(e.target.value)}
            className={`mt-1 ${inputClass}`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700">Students Placed</label>
          <input
            type="number"
            placeholder="e.g. 165"
            value={placed}
            onChange={(e) => setPlaced(e.target.value)}
            className={`mt-1 ${inputClass}`}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700">Top Recruiters (comma separated)</label>
        <input
          placeholder="Microsoft, Amazon, TCS, Infosys, Deloitte"
          value={recruiters}
          onChange={(e) => setRecruiters(e.target.value)}
          className={`mt-1 ${inputClass}`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? "Recording..." : "Save placement record"}
      </button>
    </form>
  );
}
