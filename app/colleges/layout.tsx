import { Suspense } from "react";
import CollegeFilters from "@/components/CollegeFilters";

// TODO: replace these with real values from your database / API.
const cities = ["Kolkata", "Delhi", "Mumbai", "Bengaluru", "Chennai"];
const courses = ["BTech", "MTech", "MBA", "BBA", "BCA"];
const state = ["Bihar", "West Bengal", "Delhi"];

// Server component. The page below it ({children}) changes,
// but this filter bar stays in place when you move around /colleges.
export default function CollegesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* top-16 = height of the main navbar, so this sticks right under it */}
      <div className="sticky top-16 z-20 border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3">
          {/* Suspense is required around components that use useSearchParams */}
          <Suspense fallback={<div className="h-10" />}>
            <CollegeFilters cities={cities} courses={courses} state={state} />
          </Suspense>
        </div>
      </div>

      {children}
    </>
  );
}