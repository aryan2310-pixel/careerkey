"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const INPUT =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-slate-900";

export default function InfrastructureForm({
  colleges,
}: {
  colleges: { _id: string; name: string }[];
}) {
  const router = useRouter();
  const [college, setCollege] = useState(colleges[0]?._id ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin-portal/infrastructure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ college, title, description }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to create facility");
      }

      router.push("/admin-portal/infrastructure");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-line bg-white p-6 shadow-sm">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Select College</span>
        <select required value={college} onChange={(e) => setCollege(e.target.value)} className={INPUT}>
          {colleges.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium">Facility / Title</span>
        <input
          required
          placeholder="e.g. Hostels & Mess, Central Library, Sports Complex"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={INPUT}
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium">Description</span>
        <textarea
          required
          rows={5}
          placeholder="Describe hostel accommodation, lab equipments, Wi-Fi speed, cafeteria details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={INPUT}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? "Creating..." : "Save Facility"}
      </button>
    </form>
  );
}
