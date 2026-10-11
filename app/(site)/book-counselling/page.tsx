import type { Metadata } from "next";
import CounsellingForm from "./CounsellingForm";

export const metadata: Metadata = {
  title: "Book Free Counselling Call",
  description:
    "Get personalized guidance on college selection, cutoffs, courses, and fee structures from experienced counsellors.",
  alternates: { canonical: "/book-counselling" },
};

export default function BookCounsellingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] items-start">
        {/* Left: Info */}
        <div>
          <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            Free 1-on-1 Guidance
          </span>
          <h1 className="mt-4 text-3xl font-bold text-ink sm:text-4xl">
            Talk to an educational counsellor today.
          </h1>
          <p className="mt-3 text-muted">
            Share your preferred courses and marks. Our team will review colleges that match your budget and goals and call you with recommendations.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-go text-xs font-bold text-white">✓</span>
              <p className="text-sm text-slate-700"><strong>Honest facts:</strong> Transparent fee breakdowns, placement metrics, and hostel realities.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-go text-xs font-bold text-white">✓</span>
              <p className="text-sm text-slate-700"><strong>Zero spam:</strong> We only call to discuss your shortlist and answer questions.</p>
            </div>
          </div>
        </div>

        {/* Right: Lead Form */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
          <CounsellingForm />
        </div>
      </div>
    </div>
  );
}
