"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function NewInsightPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [tag, setTag] = useState("Admissions");
  const [readTime, setReadTime] = useState("4 min read");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<{ title: string; slug: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/admin-portal/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          tag,
          readTime,
          summary,
          content,
        }),
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
          setFormError(body?.error || "Failed to create insight");
        }
        return;
      }

      setCreated({ title, slug });
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-slate-900";

  return (
    <>
      <Link href="/admin-portal" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to dashboard
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">Publish Insight / Guide</h1>
      <p className="mt-1 text-sm text-slate-500">
        Write an informative admission guide or campus article for students and parents.
      </p>

      <div className="mt-6 max-w-2xl">
        {created ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-sm text-green-900">
            <h3 className="font-bold text-base">Article Published!</h3>
            <p className="mt-1">
              &quot;{created.title}&quot; is now live on the public site.
            </p>
            <div className="mt-4 flex gap-4 font-semibold">
              <Link href={`/insights/${created.slug}`} target="_blank" className="text-brand underline">
                View Live Article →
              </Link>
              <Link href="/insights" className="text-slate-700 underline">
                All Insights
              </Link>
              <button
                type="button"
                onClick={() => {
                  setCreated(null);
                  setTitle("");
                  setSlug("");
                  setSlugTouched(false);
                  setSummary("");
                  setContent("");
                }}
                className="text-brand underline"
              >
                + Write Another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-line bg-white p-6 shadow-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Article Title</label>
              <input
                required
                placeholder="e.g. How to evaluate engineering branch cutoffs"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                className={`mt-1 ${inputClass}`}
              />
              {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Slug</label>
                <input
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  className={`mt-1 ${inputClass}`}
                />
                {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">Tag / Category</label>
                <select value={tag} onChange={(e) => setTag(e.target.value)} className={`mt-1 ${inputClass}`}>
                  <option value="Admissions">Admissions</option>
                  <option value="Placements">Placements</option>
                  <option value="Campus">Campus & Hostels</option>
                  <option value="Fees">Fees & Scholarships</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Read Time</label>
              <input
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 5 min read"
                className={`mt-1 ${inputClass}`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Short Summary</label>
              <textarea
                required
                rows={2}
                placeholder="Key takeaway that shows up in preview cards..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className={`mt-1 ${inputClass}`}
              />
              {errors.summary && <p className="mt-1 text-xs text-red-600">{errors.summary}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Full Article Content</label>
              <textarea
                required
                rows={6}
                placeholder="Write the full guide details here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`mt-1 ${inputClass}`}
              />
              {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content}</p>}
            </div>

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "Publishing..." : "Publish Guide"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
