"use client";

import { useState } from "react";
import Link from "next/link";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function NewInsightPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tag, setTag] = useState("Admissions");
  const [readTime, setReadTime] = useState("4 min read");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPublished(true);
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
        {published ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-sm text-green-900">
            <h3 className="font-bold">Article Draft Ready!</h3>
            <p className="mt-1">
              &quot;{title}&quot; has been recorded. You can view existing insights on the public site.
            </p>
            <Link href="/insights" className="mt-4 inline-block font-semibold text-brand underline">
              View Insights Page →
            </Link>
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
                  setSlug(slugify(e.target.value));
                }}
                className={`mt-1 ${inputClass}`}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Slug</label>
                <input
                  required
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  className={`mt-1 ${inputClass}`}
                />
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
            </div>

            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Publish Guide
            </button>
          </form>
        )}
      </div>
    </>
  );
}
