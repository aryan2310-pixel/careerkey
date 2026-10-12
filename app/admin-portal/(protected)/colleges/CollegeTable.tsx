"use client";

import { useState } from "react";
import Link from "next/link";

export type CollegeRow = {
  _id: string;
  name: string;
  slug: string;
  city: string;
  state?: string;
  instituteType: string;
};

export default function CollegeTable({ initialColleges }: { initialColleges: CollegeRow[] }) {
  const [colleges, setColleges] = useState<CollegeRow[]>(initialColleges);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?\nThis will permanently delete this college and its associated courses and data.`
    );
    if (!confirmed) return;

    setError(null);
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin-portal/colleges/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Failed to delete college");
      }
      setColleges((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete college");
    } finally {
      setDeletingId(null);
    }
  }

  if (colleges.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted">
        No colleges found.{" "}
        <Link href="/admin-portal/colleges/new" className="font-semibold text-brand underline">
          Create your first college
        </Link>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
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
            <tr key={c._id} className="hover:bg-slate-50">
              <td className="px-5 py-4 font-medium text-ink">{c.name}</td>
              <td className="px-5 py-4 text-muted">
                {c.city}{c.state ? `, ${c.state}` : ""}
              </td>
              <td className="px-5 py-4 capitalize text-muted">{c.instituteType}</td>
              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-3 text-xs font-semibold">
                  <Link
                    href={`/admin-portal/colleges/${c._id}/edit`}
                    className="rounded bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-slate-200"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(c._id, c.name)}
                    disabled={deletingId === c._id}
                    className="rounded bg-red-50 px-2.5 py-1 text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    {deletingId === c._id ? "Deleting..." : "Delete"}
                  </button>
                  <Link
                    href={`/colleges/${c.slug}`}
                    target="_blank"
                    className="text-brand hover:underline"
                  >
                    View live →
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
