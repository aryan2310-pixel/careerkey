import Link from "next/link";
import type { CourseData } from "@/lib/courses";

// Server component: no state or click handlers.
export default function CourseCard({ course }: { course: CourseData }) {
  return (
    <article className="flex flex-col rounded-xl border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
          {course.level}
        </span>
        <span className="text-sm font-medium text-muted">{course.duration}</span>
      </div>

      <h3 className="mt-4 text-xl font-bold text-ink">{course.name}</h3>
      <p className="text-sm font-medium text-muted">{course.fullName}</p>
      <p className="mt-3 text-sm text-muted">{course.description}</p>

      {/* mt-auto keeps the button at the bottom of every card */}
      <Link
        href={`/colleges?course=${encodeURIComponent(course.name)}`}
        aria-label={`View colleges offering ${course.name}`}
        className="mt-auto inline-block w-fit rounded-lg bg-go px-4 py-2 text-sm font-semibold text-white hover:bg-go-dark"
      >
        View colleges
      </Link>
    </article>
  );
}