"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected runtime error
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        Unexpected Error
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        An error occurred while loading this page. You can try refreshing the page or head back to the homepage.
      </p>

      {error.digest && (
        <p className="mt-2 text-xs font-mono text-slate-400">
          Error ID: {error.digest}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:border-brand hover:text-brand"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
