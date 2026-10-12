import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Insight } from "@/models/Insight";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const article = await Insight.findOne({ slug: slug.toLowerCase() }).lean();
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | CareerKey Insights`,
    description: article.summary,
    alternates: { canonical: `/insights/${article.slug}` },
  };
}

export default async function InsightDetailPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  const article = await Insight.findOne({ slug: slug.toLowerCase() }).lean();

  if (!article) notFound();

  // Split content by paragraphs
  const paragraphs = article.content.split(/\n+/).filter((p) => p.trim().length > 0);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <Link href="/insights" className="text-sm font-medium text-slate-500 hover:text-brand">
        ← Back to all guides
      </Link>

      <header className="mt-6">
        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
          {article.tag}
        </span>
        <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">
          {article.title}
        </h1>
        {article.readTime && (
          <p className="mt-2 text-sm text-muted">{article.readTime} • Published for students &amp; parents</p>
        )}
      </header>

      <div className="mt-8 border-t border-line pt-6 text-slate-700 space-y-5 leading-relaxed">
        <p className="text-lg font-medium text-ink">{article.summary}</p>
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-line bg-brand-soft/40 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-ink">Need guidance on this topic?</h3>
        <p className="mt-1 text-sm text-muted">
          Our counsellors can help answer your questions about colleges, cutoffs, and admissions.
        </p>
        <Link
          href="/book-counselling"
          className="mt-4 inline-block rounded-lg bg-go px-5 py-2.5 text-sm font-semibold text-white hover:bg-go-dark"
        >
          Book a free counselling call
        </Link>
      </div>
    </article>
  );
}
