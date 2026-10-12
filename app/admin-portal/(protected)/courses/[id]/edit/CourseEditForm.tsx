"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type CourseData = {
  _id: string;
  name: string;
  slug: string;
  level?: string;
  durationYears?: number;
  eligibility?: string;
};

const INPUT =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-slate-900";

export default function CourseEditForm({ course }: { course: CourseData }) {
  const router = useRouter();
  const [name, setName] = useState(course.name);
  const [slug, setSlug] = useState(course.slug);
  const [level, setLevel] = useState(course.level ?? "undergraduate");
  const [duration, setDuration] = useState(String(course.durationYears ?? 4));
  const [eligibility, setEligibility] = useState(course.eligibility ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`/api/admin-portal/courses/${course._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          level,
          durationYears: Number(duration),
          eligibility: eligibility.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update course");
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
          Course updated successfully!{" "}
          <Link href="/admin-portal/courses" className="font-semibold underline">
            Back to courses
          </Link>
        </div>
      )}
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Course Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-1 ${INPUT}`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700">Slug</label>
          <input
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={`mt-1 ${INPUT}`}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Level</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={`mt-1 ${INPUT}`}>
            <option value="diploma">Diploma</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="postgraduate">Postgraduate</option>
            <option value="doctorate">Doctorate</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700">Duration (Years)</label>
          <input
            type="number"
            min={1}
            max={10}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className={`mt-1 ${INPUT}`}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700">Eligibility Criteria</label>
        <textarea
          rows={3}
          value={eligibility}
          onChange={(e) => setEligibility(e.target.value)}
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
          href="/admin-portal/courses"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
