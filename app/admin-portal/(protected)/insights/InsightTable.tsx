"use client";

import { useState } from "react";
import Link from "next/link";

type InsightRow = {
  _id: string;
  title: string;
  slug: string;
  tag: string;
  readTime?: string;
  createdAt: string;
};

export default function InsightTable({ initialInsights }: { initialInsights: InsightRow[] }) {
  const [insights, setInsights] = useState(initialInsights);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete guide "${title}"?`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin-portal/insights/${id}`, { method: "DELETE" });
    if (res.ok) setInsights((prev) => prev.filter((i) => i._id !== id));
    setDeletingId(null);
  }

  if (insights.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted">
        No articles published yet.{" "}
        <Link href="/admin-portal/insights/new" className="font-semibold text-brand underline">
          Publish first article
        </Link>
      </div>
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-line bg-slate-50 text-xs font-semibold uppercase text-muted">
        <tr>
          <th className="px-5 py-3">Article Title</th>
          <th className="px-5 py-3">Category</th>
          <th className="px-5 py-3">Read Time</th>
          <th className="px-5 py-3">Published Date</th>
          <th className="px-5 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {insights.map((article) => (
          <tr key={article._id} className="hover:bg-slate-50">
            <td className="px-5 py-4 font-medium text-ink">{article.title}</td>
            <td className="px-5 py-4">
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                {article.tag}
              </span>
            </td>
            <td className="px-5 py-4 text-muted">{article.readTime ?? "—"}</td>
            <td className="px-5 py-4 text-muted">{article.createdAt}</td>
            <td className="px-5 py-4 text-right">
              <div className="flex items-center justify-end gap-3 text-xs font-semibold">
                <Link
                  href={`/insights/${article.slug}`}
                  target="_blank"
                  className="text-brand hover:underline"
                >
                  View live →
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(article._id, article.title)}
                  disabled={deletingId === article._id}
                  className="rounded bg-red-50 px-2.5 py-1 text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  {deletingId === article._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
