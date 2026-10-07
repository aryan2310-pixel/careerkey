import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import CollegeCard from "@/components/CollegeCard";
import { getColleges } from "@/lib/colleges";

// Filtered URLs (?city=...) all point to /colleges as the main version,
// so Google doesn't treat each filter as a duplicate page.
export const metadata: Metadata = {
  title: "Colleges",
  description:
    "Browse colleges by city and course. See institute type, location, fees and placements before you decide.",
  alternates: { canonical: "/colleges" },
};

type SearchParams = Promise<{ city?: string; course?: string }>;

export default function CollegesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink">Colleges</h1>

      {/* The list reads the URL filters, so it loads inside Suspense */}
      <Suspense fallback={<ListSkeleton />}>
        <CollegeList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CollegeList({ searchParams }: { searchParams: SearchParams }) {
  const { city } = await searchParams;
  const colleges = await getColleges({ city });

  if (colleges.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-line bg-white p-8 text-center">
        <p className="font-semibold text-ink">No colleges match these filters.</p>
        <Link href="/colleges" className="mt-2 inline-block text-sm text-brand hover:underline">
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mt-2 text-muted">{colleges.length} colleges found</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {colleges.map((college) => (
          <CollegeCard key={college.id} college={college} />
        ))}
      </div>
    </>
  );
}

// Grey placeholder boxes shown while the list loads
function ListSkeleton() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-72 animate-pulse rounded-xl bg-brand-soft" />
      ))}
    </div>
  );
}