"use client";

import { useState } from "react";

export default function CounsellingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Simulate submission delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  }

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-go text-xl font-bold">
          ✓
        </div>
        <h2 className="mt-4 text-xl font-bold text-ink">Request Received!</h2>
        <p className="mt-2 text-sm text-muted">
          Our senior counsellor will review your details and call you shortly.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-ink">Book Your Free Call</h2>

      <div>
        <label className="block text-xs font-semibold text-slate-700">Full name</label>
        <input required type="text" placeholder="Aarav Sharma" className={`mt-1 ${inputClass}`} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700">Phone number</label>
        <input required type="tel" placeholder="+91 98765 43210" className={`mt-1 ${inputClass}`} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700">City</label>
          <input required type="text" placeholder="Kolkata" className={`mt-1 ${inputClass}`} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700">Course</label>
          <select required defaultValue="" className={`mt-1 ${inputClass}`}>
            <option value="" disabled>Select</option>
            <option value="BTech">BTech</option>
            <option value="MBA">MBA</option>
            <option value="BBA">BBA</option>
            <option value="BCA">BCA</option>
            <option value="MTech">MTech</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700">Questions (optional)</label>
        <textarea
          rows={3}
          placeholder="e.g. Inquiring about cutoffs, fees, or hostel facilities..."
          className={`mt-1 ${inputClass}`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-go px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-go-dark disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Schedule Callback"}
      </button>
    </form>
  );
}
