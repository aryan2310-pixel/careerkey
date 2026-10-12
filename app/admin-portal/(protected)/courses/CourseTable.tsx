"use client";

import { useState } from "react";
import Link from "next/link";

type CourseRow = {
  _id: string;
  name: string;
  slug: string;
  collegeName: string;
  durationYears?: number;
  level?: string;
};

export default function CourseTable({ initialCourses }: { initialCourses: CourseRow[] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete course "${name}" and all attached programs/fees?`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin-portal/courses/${id}`, { method: "DELETE" });
    if (res.ok) setCourses((prev) => prev.filter((c) => c._id !== id));
    setDeletingId(null);
  }

  if (courses.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted">
        No courses found.{" "}
        <Link href="/admin-portal/courses/new" className="font-semibold text-brand underline">
          Create first course
        </Link>
      </div>
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-line bg-slate-50 text-xs font-semibold uppercase text-muted">
        <tr>
          <th className="px-5 py-3">Course</th>
          <th className="px-5 py-3">College</th>
          <th className="px-5 py-3">Duration</th>
          <th className="px-5 py-3">Level</th>
          <th className="px-5 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {courses.map((c) => (
          <tr key={c._id} className="hover:bg-slate-50">
            <td className="px-5 py-4 font-medium text-ink">{c.name}</td>
            <td className="px-5 py-4 text-muted">{c.collegeName}</td>
            <td className="px-5 py-4 text-muted">{c.durationYears ? `${c.durationYears} yrs` : "—"}</td>
            <td className="px-5 py-4 capitalize text-muted">{c.level ?? "—"}</td>
            <td className="px-5 py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/admin-portal/courses/${c._id}/edit`}
                  className="rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(c._id, c.name)}
                  disabled={deletingId === c._id}
                  className="rounded bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  {deletingId === c._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
