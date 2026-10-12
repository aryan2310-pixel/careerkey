"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type InitialCollegeData = {
  _id: string;
  name: string;
  slug: string;
  city: string;
  state?: string;
  shortAddress?: string;
  image?: string;
  instituteType: string;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const INPUT =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-slate-900";

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export default function CollegeEditForm({ college }: { college: InitialCollegeData }) {
  const router = useRouter();
  const [name, setName] = useState(college.name);
  const [slug, setSlug] = useState(college.slug);
  const [city, setCity] = useState(college.city);
  const [state, setState] = useState(college.state ?? "");
  const [shortAddress, setShortAddress] = useState(college.shortAddress ?? "");
  const [image, setImage] = useState(college.image ?? "");
  const [instituteType, setInstituteType] = useState(college.instituteType);

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    setErrors({});
    setSuccess(false);
    setLoading(true);

    const payload: Record<string, string> = {
      name,
      slug,
      city,
      state,
      shortAddress,
      image,
      instituteType,
    };

    // Remove empty optional strings so validator doesn't reject them
    for (const key of ["state", "shortAddress", "image"]) {
      if (!payload[key]?.trim()) delete payload[key];
    }

    try {
      const res = await fetch(`/api/admin-portal/colleges/${college._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => null);

      if (res.status === 401) {
        router.replace("/admin-portal/login");
        return;
      }

      if (!res.ok) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of body?.issues ?? []) {
          if (issue.path) fieldErrors[issue.path] = issue.message;
        }
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length === 0) {
          setFormError(body?.error ?? "Could not update college");
        }
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);
    setFormError("");

    try {
      const res = await fetch(`/api/admin-portal/colleges/${college._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Failed to delete college");
      }
      router.push("/admin-portal/colleges");
    } catch (err: any) {
      setFormError(err.message || "Failed to delete college");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-line bg-white p-6 shadow-sm">
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          <strong>Changes saved!</strong>{" "}
          <Link href={`/colleges/${slug}`} target="_blank" className="font-semibold underline">
            View public page →
          </Link>
        </div>
      )}

      <Field label="College name" error={errors.name}>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={INPUT}
        />
      </Field>

      <Field
        label="Slug"
        error={errors.slug}
        hint="Used in the URL: /colleges/your-slug."
      >
        <div className="flex gap-2">
          <input
            required
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            className={INPUT}
          />
          <button
            type="button"
            onClick={() => setSlug(slugify(name))}
            className="shrink-0 rounded-lg border border-line bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Regenerate
          </button>
        </div>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="City" error={errors.city}>
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={INPUT}
          />
        </Field>
        <Field label="State" error={errors.state}>
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={INPUT}
          />
        </Field>
      </div>

      <Field label="Short address" error={errors.shortAddress}>
        <input
          value={shortAddress}
          onChange={(e) => setShortAddress(e.target.value)}
          className={INPUT}
        />
      </Field>

      <Field
        label="Cover image URL"
        error={errors.image}
        hint="Must start with http:// or https://"
      >
        <input
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className={INPUT}
        />
      </Field>

      <Field label="Institute type" error={errors.instituteType}>
        <select
          required
          value={instituteType}
          onChange={(e) => setInstituteType(e.target.value)}
          className={INPUT}
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
          <option value="both">Both</option>
        </select>
      </Field>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="flex items-center justify-between pt-2">
        <button
          type="submit"
          disabled={loading || deleting}
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={loading || deleting}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete college"}
        </button>
      </div>
    </form>
  );
}
