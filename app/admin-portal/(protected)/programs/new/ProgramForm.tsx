"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const INPUT =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-slate-900";

export default function ProgramForm({
  courses,
}: {
  courses: { _id: string; name: string }[];
}) {
  const router = useRouter();
  const [course, setCourse] = useState(courses[0]?._id ?? "");
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [slug, setSlug] = useState("");
  const [seats, setSeats] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin-portal/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course,
          name,
          shortName: shortName || undefined,
          slug,
          seats: seats ? Number(seats) : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to create program");
      }

      router.push("/admin-portal/programs");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-line bg-white p-6 shadow-sm">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Select Course</span>
        <select required value={course} onChange={(e) => setCourse(e.target.value)} className={INPUT}>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium">Program Name</span>
        <input
          required
          placeholder="e.g. Computer Science and Engineering"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSlug(slugify(e.target.value));
          }}
          className={INPUT}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Short Name</span>
          <input
            placeholder="e.g. CSE"
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            className={INPUT}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Total Seats</span>
          <input
            type="number"
            min="0"
            placeholder="e.g. 120"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            className={INPUT}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium">Slug</span>
        <input required value={slug} onChange={(e) => setSlug(slugify(e.target.value))} className={INPUT} />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? "Creating..." : "Save Program"}
      </button>
    </form>
  );
}
