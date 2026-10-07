import type { Metadata } from "next";
import CourseCard from "@/components/CourseCard";
import { getCourses, type CourseLevel } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Explore undergraduate and postgraduate courses such as BTech, MTech, MBA and BBA, and find colleges that offer them.",
  alternates: { canonical: "/courses" },
};

const levels: CourseLevel[] = ["Undergraduate", "Postgraduate"];

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink">Courses</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Pick a course to see the colleges that offer it.
      </p>

      {levels.map((level) => {
        const group = courses.filter((c) => c.level === level);
        if (group.length === 0) return null;

        return (
          <section key={level} className="mt-10">
            <h2 className="text-xl font-bold text-ink">{level} courses</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((course) => (
                <CourseCard key={course.slug} course={course} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}