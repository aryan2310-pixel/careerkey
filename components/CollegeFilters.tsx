"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  cities: string[];
  courses: string[];
  state : string[]
};

// Client component: it needs the browser URL and change handlers.
// Filters live in the URL (?city=Kolkata&course=BTech), so they can be
// shared, bookmarked, and read by the server page.
export default function CollegeFilters({ cities, courses, state }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) params.set(key, value);
    else params.delete(key);

    params.delete("page"); // a new filter should start from page 1

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const hasFilters = searchParams.has("city") || searchParams.has("course");
  const selectClass =
    "rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2 text-sm font-medium text-muted">
        City
        <select
          value={searchParams.get("city") ?? ""}
          onChange={(e) => setFilter("city", e.target.value)}
          className={selectClass}
        >
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-muted">
        Course
        <select
          value={searchParams.get("course") ?? ""}
          onChange={(e) => setFilter("course", e.target.value)}
          className={selectClass}
        >
          <option value="">All courses</option>
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-muted">
        State
        <select
          value={searchParams.get("state") ?? ""}
          onChange={(e) => setFilter("state", e.target.value)}
          className={selectClass}
        >
          <option value="">select state</option>
          {state.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </label>

      {hasFilters && (
        <button
          type="button"
          onClick={() => router.push(pathname, { scroll: false })}
          className="text-sm font-medium text-brand hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}