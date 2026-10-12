"use client";

import { useState } from "react";
import Link from "next/link";

type InfrastructureRow = {
  _id: string;
  collegeName: string;
  title: string;
  description: string;
};

export default function InfrastructureTable({
  initialItems,
}: {
  initialItems: InfrastructureRow[];
}) {
  const [items, setItems] = useState(initialItems);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete facility "${title}"?`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin-portal/infrastructure/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i._id !== id));
    setDeletingId(null);
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted">
        No facilities recorded.{" "}
        <Link href="/admin-portal/infrastructure/new" className="font-semibold text-brand underline">
          Add campus facility
        </Link>
      </div>
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-line bg-slate-50 text-xs font-semibold uppercase text-muted">
        <tr>
          <th className="px-5 py-3">Facility</th>
          <th className="px-5 py-3">College</th>
          <th className="px-5 py-3">Description</th>
          <th className="px-5 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {items.map((item) => (
          <tr key={item._id} className="hover:bg-slate-50">
            <td className="px-5 py-4 font-medium text-ink">{item.title}</td>
            <td className="px-5 py-4 text-muted">{item.collegeName}</td>
            <td className="px-5 py-4 text-muted max-w-xs truncate">{item.description}</td>
            <td className="px-5 py-4 text-right">
              <button
                type="button"
                onClick={() => handleDelete(item._id, item.title)}
                disabled={deletingId === item._id}
                className="rounded bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
              >
                {deletingId === item._id ? "Deleting..." : "Delete"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
