import type { Metadata } from "next";

// SEO: title, description and canonical URL for this page.
// The title becomes "About us | CampusPath" through the template in layout.tsx.
export const metadata: Metadata = {
  title: "About us",
  description:
    "We write clear guides on colleges, courses, fees, placements and hostels, and our counsellors call students to help them choose.",
  alternates: { canonical: "/about" },
};

const offerings = [
  {
    title: "College guides",
    body: "Each college page covers courses, eligibility, fees, placements and hostel life in one place, so you don't have to search ten websites.",
  },
  {
    title: "Counselling calls",
    body: "Fill a short form and a counsellor from our team phones you to talk through your marks, budget and preferred city.",
  },
  {
    title: "Plain information",
    body: "We show fees and placement numbers as they are and explain how to read them, so you can judge for yourself.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Intro */}
      <section className="border-b border-line bg-brand-soft">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <h1 className="text-4xl font-bold text-ink md:text-5xl">
            Helping students choose a college with confidence
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Picking a college is one of the biggest decisions a student and
            their family make. We publish clear guides and offer a real
            conversation with a counsellor, so that decision rests on facts.
          </p>
        </div>
      </section>

      {/* What we do */}
      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-2xl font-bold text-ink">What we do</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {offerings.map((item) => (
            <div key={item.title} className="border-l-4 border-gold pl-5">
              <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our story: TODO replace with your real story and team details */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-2xl font-bold text-ink">Why we built this</h2>
          <p className="mt-4 max-w-2xl text-muted">
            {/* TODO: write 2-3 sentences about who you are and why you started. */}
            Students often have to piece together fees, placements and campus
            details from many scattered sources. We wanted one trustworthy
            place for all of it, backed by people who answer the phone.
          </p>
        </div>
      </section>


    </>
  );
}