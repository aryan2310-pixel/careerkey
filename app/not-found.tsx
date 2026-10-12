import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
        404 Error
      </span>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-base text-muted">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, removed, or the link may be broken.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Back to Home
        </Link>
        <Link
          href="/colleges"
          className="rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:border-brand hover:text-brand"
        >
          Browse Colleges
        </Link>
        <Link
          href="/courses"
          className="rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:border-brand hover:text-brand"
        >
          Explore Courses
        </Link>
      </div>
    </main>
  );
}
