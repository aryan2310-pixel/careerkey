"use client";

import { useState } from "react";
import Link from "next/link";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function CourseForm({
  colleges,
}: {
  colleges: { _id: string; name: string }[];
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [college, setCollege] = useState(colleges[0]?._id ?? "");
  const [level, setLevel] = useState("undergraduate");
  const [duration, setDuration] = useState("4");
  const [eligibility, setEligibility] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin-portal/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college,
          name,
          slug,
          level,
          durationYears: Number(duration),
          eligibility: eligibility.trim() || undefined,
          entranceExams: [],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create course");
      } else {
        setMsg(`Course "${data.data.name}" added successfully!`);
        setName("");
        setSlug("");
        setEligibility("");
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
        <label className="block text-xs font-semibold text-slate-700">Select College</label>
        <select
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          required
          className={`mt-1 ${inputClass}`}
        >
          {colleges.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Course Name</label>
          <input
            required
            placeholder="e.g. BTech, MBA"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(slugify(e.target.value));
            }}
            className={`mt-1 ${inputClass}`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700">Slug</label>
          <input
            required
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            className={`mt-1 ${inputClass}`}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Level</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={`mt-1 ${inputClass}`}>
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
            className={`mt-1 ${inputClass}`}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700">Eligibility (optional)</label>
        <textarea
          rows={2}
          placeholder="e.g. 10+2 with Physics, Chemistry and Maths (min 60%)"
          value={eligibility}
          onChange={(e) => setEligibility(e.target.value)}
          className={`mt-1 ${inputClass}`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? "Adding course..." : "Add course"}
      </button>
    </form>
  );
}
