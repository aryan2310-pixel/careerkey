"use client";

import { useState } from "react";

const INPUT =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand";

export default function CounsellingForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    course: "",
    questions: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || data?.issues?.[0]?.message || "Failed to submit");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-ink">Book Your Free Call</h2>

      <div>
        <label className="block text-xs font-semibold text-slate-700">Full name</label>
        <input
          required
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Aarav Sharma"
          className={`mt-1 ${INPUT}`}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700">Phone number</label>
        <input
          required
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 98765 43210"
          className={`mt-1 ${INPUT}`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700">City</label>
          <input
            required
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Kolkata"
            className={`mt-1 ${INPUT}`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700">Course</label>
          <select
            required
            name="course"
            value={formData.course}
            onChange={handleChange}
            className={`mt-1 ${INPUT}`}
          >
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
          name="questions"
          value={formData.questions}
          onChange={handleChange}
          placeholder="Inquiring about cutoffs, fees, or hostel facilities..."
          className={`mt-1 ${INPUT}`}
        />
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

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
