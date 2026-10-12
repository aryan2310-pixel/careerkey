"use client";

import { useState } from "react";
import Link from "next/link";

type PlacementRow = {
  _id: string;
  courseName: string;
  academicYear: string;
  highestPackageLPA?: number;
  averagePackageLPA?: number;
  placedStats?: string;
};

export default function PlacementTable({
  initialPlacements,
}: {
  initialPlacements: PlacementRow[];
}) {
  const [placements, setPlacements] = useState(initialPlacements);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string, year: string) {
    if (!window.confirm(`Delete placement stats for ${name} (${year})?`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin-portal/placements/${id}`, { method: "DELETE" });
    if (res.ok) setPlacements((prev) => prev.filter((p) => p._id !== id));
    setDeletingId(null);
  }

  if (placements.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted">
        No placement stats recorded.{" "}
        <Link href="/admin-portal/placements/new" className="font-semibold text-brand underline">
          Record placements
        </Link>
      </div>
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-line bg-slate-50 text-xs font-semibold uppercase text-muted">
        <tr>
          <th className="px-5 py-3">Course / Program</th>
          <th className="px-5 py-3">Academic Year</th>
          <th className="px-5 py-3">Highest Package</th>
          <th className="px-5 py-3">Average Package</th>
          <th className="px-5 py-3">Placed / Eligible</th>
          <th className="px-5 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {placements.map((p) => (
          <tr key={p._id} className="hover:bg-slate-50">
            <td className="px-5 py-4 font-medium text-ink">{p.courseName}</td>
            <td className="px-5 py-4 text-muted">{p.academicYear}</td>
            <td className="px-5 py-4 text-muted">{p.highestPackageLPA ? `${p.highestPackageLPA} LPA` : "—"}</td>
            <td className="px-5 py-4 text-muted">{p.averagePackageLPA ? `${p.averagePackageLPA} LPA` : "—"}</td>
            <td className="px-5 py-4 text-muted">{p.placedStats ?? "—"}</td>
            <td className="px-5 py-4 text-right">
              <button
                type="button"
                onClick={() => handleDelete(p._id, p.courseName, p.academicYear)}
                disabled={deletingId === p._id}
                className="rounded bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
              >
                {deletingId === p._id ? "Deleting..." : "Delete"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
