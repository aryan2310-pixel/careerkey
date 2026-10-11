"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function CollegeForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<{ name: string; slug: string } | null>(null);

  function onNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setFormError("");
    setErrors({});
    setLoading(true);

    const data = new FormData(formEl);
    const payload: Record<string, string> = {
      name,
      slug,
      city: String(data.get("city") ?? ""),
      state: String(data.get("state") ?? ""),
      shortAddress: String(data.get("shortAddress") ?? ""),
      image: String(data.get("image") ?? ""),
      instituteType: String(data.get("instituteType") ?? ""),
    };
    // empty optional fields must be left out, the validator rejects ""
    for (const key of ["state", "shortAddress", "image"]) {
      if (!payload[key].trim()) delete payload[key];
    }

    try {
      const res = await fetch("/api/admin-portal/colleges", {
        method: "POST",
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
          setFormError(body?.error ?? "Could not create college");
        }
        return;
      }

      setCreated({ name: body.data.name, slug: body.data.slug });
      formEl.reset();
      setName("");
      setSlug("");
      setSlugTouched(false);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-line bg-white p-6">
      {created && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          <strong>{created.name}</strong> was created.{" "}
          <Link href={`/colleges/${created.slug}`} className="underline">
            View public page
          </Link>
        </div>
      )}

      <Field label="College name" error={errors.name}>
        <input
          required
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className={INPUT}
          placeholder="Heritage Institute of Technology"
        />
      </Field>

      <Field
        label="Slug"
        error={errors.slug}
        hint="Used in the URL: /colleges/your-slug. Generated from the name, but you can edit it."
      >
        <input
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          className={INPUT}
          placeholder="heritage-institute-of-technology"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="City" error={errors.city}>
          <input name="city" required className={INPUT} placeholder="Kolkata" />
        </Field>
        <Field label="State" error={errors.state}>
          <input name="state" className={INPUT} placeholder="West Bengal" />
        </Field>
      </div>

      <Field label="Short address" error={errors.shortAddress}>
        <input name="shortAddress" className={INPUT} placeholder="Chowbaga Road, Anandapur" />
      </Field>

      <Field
        label="Cover image URL"
        error={errors.image}
        hint="Must start with http:// or https://"
      >
        <input name="image" type="url" className={INPUT} placeholder="https://..." />
      </Field>

      <Field label="Institute type" error={errors.instituteType}>
        <select name="instituteType" required defaultValue="" className={INPUT}>
          <option value="" disabled>
            Select type
          </option>
          <option value="private">Private</option>
          <option value="public">Public</option>
          <option value="both">Both</option>
        </select>
      </Field>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create college"}
      </button>
    </form>
  );
}