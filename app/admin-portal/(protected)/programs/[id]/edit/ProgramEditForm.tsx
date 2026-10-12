"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type ProgramData = {
  _id: string;
  name: string;
  shortName?: string;
  slug: string;
  seats?: number;
  accreditation?: string;
};

const INPUT =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-slate-900";

export default function ProgramEditForm({ program }: { program: ProgramData }) {
  const router = useRouter();
  const [name, setName] = useState(program.name);
  const [shortName, setShortName] = useState(program.shortName ?? "");
  const [slug, setSlug] = useState(program.slug);
  const [seats, setSeats] = useState(program.seats ? String(program.seats) : "");
  const [accreditation, setAccreditation] = useState(program.accreditation ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`/api/admin-portal/programs/${program._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          shortName: shortName.trim() || undefined,
          slug,
          seats: seats ? Number(seats) : undefined,
          accreditation: accreditation.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update program");
      } else {
        setSuccess(true);
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-line bg-white p-6 shadow-sm">
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          Program updated successfully!{" "}
          <Link href="/admin-portal/programs" className="font-semibold underline">
            Back to programs
          </Link>
        </div>
      )}
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div>
        <label className="block text-xs font-semibold text-slate-700">Program Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`mt-1 ${INPUT}`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Short Name</label>
          <input
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            className={`mt-1 ${INPUT}`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700">Total Seats</label>
          <input
            type="number"
            min={0}
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            className={`mt-1 ${INPUT}`}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Slug</label>
          <input
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={`mt-1 ${INPUT}`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700">Accreditation</label>
          <input
            placeholder="e.g. NBA, NAAC A+"
            value={accreditation}
            onChange={(e) => setAccreditation(e.target.value)}
            className={`mt-1 ${INPUT}`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <Link
          href="/admin-portal/programs"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
