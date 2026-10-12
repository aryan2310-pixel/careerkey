import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Insight } from "@/models/Insight";

export const metadata: Metadata = {
  title: "Insights & Admission Guides",
  description:
    "Honest guides on college admissions, fees, placement reports, and campus life to help students make informed decisions.",
  alternates: { canonical: "/insights" },
};

export default async function InsightsPage() {
  await connectDB();
  const articles = await Insight.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="max-w-2xl">
        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
          Knowledge Base
        </span>
        <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">
          Insights &amp; Admission Guides
        </h1>
        <p className="mt-3 text-muted">
          Written by advisors and alumni to help you navigate admissions, cut through marketing claims, and compare colleges honestly.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-line bg-white p-10 text-center">
          <p className="text-muted">No articles published yet. Check back soon.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={String(article._id)}
              className="flex flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-sm transition hover:border-brand"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-go">{article.tag}</span>
                  {article.readTime && <span className="text-muted">{article.readTime}</span>}
                </div>
                <h2 className="mt-3 text-xl font-bold text-ink hover:text-brand">
                  <Link href={`/insights/${article.slug}`}>{article.title}</Link>
                </h2>
                <p className="mt-2 text-sm text-muted line-clamp-3">{article.summary}</p>
              </div>

              <Link
                href={`/insights/${article.slug}`}
                className="mt-6 text-sm font-semibold text-brand hover:underline"
              >
                Read guide →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}