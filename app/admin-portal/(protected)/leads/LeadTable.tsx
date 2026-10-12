"use client";

import { useState } from "react";

export type LeadRow = {
  _id: string;
  fullName: string;
  phone: string;
  city: string;
  course: string;
  questions?: string;
  status: "new" | "contacted" | "enrolled" | "closed";
  createdAt: string;
};

const statusColors: Record<LeadRow["status"], string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-amber-50 text-amber-700 border-amber-200",
  enrolled: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function LeadTable({ initialLeads }: { initialLeads: LeadRow[] }) {
  const [leads, setLeads] = useState<LeadRow[]>(initialLeads);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange(id: string, newStatus: LeadRow["status"]) {
    setUpdatingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/admin-portal/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setLeads((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l))
      );
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete inquiry from "${name}"?`)) return;

    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/admin-portal/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete lead");

      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete lead");
    } finally {
      setDeletingId(null);
    }
  }

  if (leads.length === 0) {
    return (
      <div className="p-12 text-center text-sm text-muted">
        No student inquiries submitted yet.
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
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-slate-50 text-xs font-semibold uppercase text-muted">
            <tr>
              <th className="px-5 py-3">Student Name</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Course & City</th>
              <th className="px-5 py-3">Questions / Note</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {leads.map((lead) => {
              const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
              const formattedDate = new Date(lead.createdAt).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <tr key={lead._id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="font-medium text-ink">{lead.fullName}</div>
                    <div className="text-xs text-muted">{formattedDate}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-mono text-sm text-ink">{lead.phone}</div>
                    <div className="mt-1 flex gap-2 text-xs">
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-brand hover:underline font-medium"
                      >
                        Call
                      </a>
                      <span className="text-slate-300">•</span>
                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 hover:underline font-medium"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-ink">{lead.course}</div>
                    <div className="text-xs text-muted">{lead.city}</div>
                  </td>
                  <td className="px-5 py-4 max-w-xs text-xs text-slate-600">
                    {lead.questions ? (
                      <p className="line-clamp-2" title={lead.questions}>
                        {lead.questions}
                      </p>
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={lead.status}
                      disabled={updatingId === lead._id}
                      onChange={(e) =>
                        handleStatusChange(lead._id, e.target.value as LeadRow["status"])
                      }
                      className={`rounded-lg border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition ${statusColors[lead.status]} cursor-pointer`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(lead._id, lead.fullName)}
                      disabled={deletingId === lead._id}
                      className="rounded bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      {deletingId === lead._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
