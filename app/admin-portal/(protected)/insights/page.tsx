import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Insight } from "@/models/Insight";
import InsightTable from "./InsightTable";

export default async function ManageInsightsPage() {
  await connectDB();
  const articles = await Insight.find().sort({ createdAt: -1 }).lean();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin-portal" className="text-sm text-slate-500 hover:text-slate-900">
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">Manage Insights & Guides</h1>
          <p className="mt-1 text-sm text-slate-500">
            {articles.length} articles published in knowledge base.
          </p>
        </div>
        <Link
          href="/admin-portal/insights/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Write guide
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-line bg-white shadow-sm overflow-hidden">
        <InsightTable
          initialInsights={articles.map((a: any) => ({
            _id: String(a._id),
            title: a.title,
            slug: a.slug,
            tag: a.tag,
            readTime: a.readTime,
            createdAt: new Date(a.createdAt).toLocaleDateString(),
          }))}
        />
      </div>
    </>
  );
}
