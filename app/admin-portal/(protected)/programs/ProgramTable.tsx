"use client";

import { useState } from "react";
import Link from "next/link";

type ProgramRow = {
  _id: string;
  name: string;
  shortName?: string;
  courseName: string;
  seats?: number;
};

export default function ProgramTable({ initialPrograms }: { initialPrograms: ProgramRow[] }) {
  const [programs, setPrograms] = useState(initialPrograms);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete program "${name}" and its placements?`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin-portal/programs/${id}`, { method: "DELETE" });
    if (res.ok) setPrograms((prev) => prev.filter((p) => p._id !== id));
    setDeletingId(null);
  }

  if (programs.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted">
        No programs found.{" "}
        <Link href="/admin-portal/programs/new" className="font-semibold text-brand underline">
          Create first program
        </Link>
      </div>
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-line bg-slate-50 text-xs font-semibold uppercase text-muted">
        <tr>
          <th className="px-5 py-3">Program Name</th>
          <th className="px-5 py-3">Course</th>
          <th className="px-5 py-3">Seats</th>
          <th className="px-5 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {programs.map((p) => (
          <tr key={p._id} className="hover:bg-slate-50">
            <td className="px-5 py-4 font-medium text-ink">
              {p.name} {p.shortName ? `(${p.shortName})` : ""}
            </td>
            <td className="px-5 py-4 text-muted">{p.courseName}</td>
            <td className="px-5 py-4 text-muted">{p.seats ?? "—"}</td>
            <td className="px-5 py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/admin-portal/programs/${p._id}/edit`}
                  className="rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(p._id, p.name)}
                  disabled={deletingId === p._id}
                  className="rounded bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  {deletingId === p._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
