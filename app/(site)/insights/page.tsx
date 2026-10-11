import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights & Guides",
  description:
    "Honest guides on college admissions, fees, placement reports, and campus life to help students make informed decisions.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
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

      <div className="mt-16 rounded-2xl border border-line bg-white p-10 text-center">
        <p className="text-muted">No articles published yet. Check back soon.</p>
      </div>
    </div>
  );
}