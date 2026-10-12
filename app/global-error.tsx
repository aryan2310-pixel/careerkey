"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center font-sans text-slate-900">
        <h1 className="text-3xl font-bold">Critical Application Error</h1>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          We encountered an unexpected critical issue. Please try refreshing.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
