import Link from "next/link";

// TODO: replace these with data from your /api/v1 routes once they're ready.
const COURSES = ["BTech", "MTech", "MBA", "BBA", "BCA", "MBBS", "BA", "BCom"];

const STEPS = [
  { title: "Fill the short form", body: "Your name, phone number and the course you're considering." },
  { title: "Our counsellor calls you", body: "We phone you to understand your marks, budget and city." },
  { title: "Get a shortlist", body: "Colleges that fit, with fees, placements and hostel details." },
];

const POSTS = [
  { slug: "sample-post-1", title: "How to read a college's placement report", tag: "Placements" },
  { slug: "sample-post-2", title: "Hostel life: what to check before you pay", tag: "Campus" },
  { slug: "sample-post-3", title: "BTech fees explained: tuition vs. total cost", tag: "Fees" },
];

const PROMISES = [
  { title: "Fees in the open", body: "Tuition per course and total programme cost, side by side." },
  { title: "Placements, not promises", body: "Highest and average packages, year by year, with top recruiters." },
  { title: "Campus and hostel covered", body: "What living there is actually like, written by people who checked." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-brand-soft/60">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Choose your college with facts, then talk to a real person.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Clear guides on courses, fees, placements and hostels. When you&aposre
              ready to decide, leave your number and our counsellor will call you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/book-counselling"
                className="rounded-lg bg-go px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-go-dark"
              >
                Book a counselling call
              </Link>
              <Link
                href="/colleges"
                className="rounded-lg border border-brand/30 bg-white px-6 py-3 font-semibold text-brand transition-colors hover:border-brand"
              >
                Browse colleges
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-6 shadow-lg shadow-brand/10 sm:p-8">
            <h2 className="text-xl font-bold">How counselling works</h2>
            <ol className="mt-6 space-y-5">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-go text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-sm text-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Browse by course */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">Start with your course</h2>
        <p className="mt-2 text-muted">See colleges offering the programme you want.</p>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COURSES.map((course) => (
            <li key={course}>
              <Link
                href={`/colleges?course=${course.toLowerCase()}`}
                className="block rounded-xl border border-line bg-white px-4 py-4 text-center font-semibold transition-colors hover:border-brand hover:text-brand"
              >
                {course}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* What you get on every college page */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3">
          {PROMISES.map((p) => (
            <div key={p.title} className="border-l-4 border-gold pl-5">
              <h3 className="text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest from the blog */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold sm:text-3xl">Latest from the blog</h2>
          <Link href="/blog" className="text-sm font-semibold text-brand hover:underline">
            All articles
          </Link>
        </div>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {POSTS.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="flex h-full flex-col rounded-xl border border-line bg-white p-6 transition-colors hover:border-brand"
              >
                <span className="text-sm font-semibold text-go">{post.tag}</span>
                <span className="mt-2 text-lg font-bold leading-snug">{post.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}