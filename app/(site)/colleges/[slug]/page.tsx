import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCollegeBySlug } from "@/lib/colleges";
import CollegeSidebar from "@/components/CollegeSidebar";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCollegeBySlug(slug);
  if (!data) return { title: "College Not Found" };

  const { college } = data;
  return {
    title: `${college.name} - Courses, Fees, Placements & Admission`,
    description: `Complete guide on ${college.name} located in ${college.city}${
      college.state ? `, ${college.state}` : ""
    }. Check courses, fee structures, placements, and campus infrastructure.`,
    alternates: { canonical: `/colleges/${college.slug}` },
  };
}

export default function CollegeDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<CollegeDetailSkeleton />}>
      <CollegeContent params={params} />
    </Suspense>
  );
}

async function CollegeContent({ params }: Props) {
  const { slug } = await params;
  const data = await getCollegeBySlug(slug);

  if (!data) notFound();

  const { college, courses, feeStructures, infrastructure, placements } = data;

  // Build dynamic navigation tabs based on available content
  const sections = [
    { id: "overview", label: "Overview" },
    ...(courses.length ? [{ id: "courses", label: "Courses" }] : []),
    ...(feeStructures.length ? [{ id: "fees", label: "Fee Structure" }] : []),
    ...(placements.length ? [{ id: "placements", label: "Placements" }] : []),
    ...(infrastructure.length ? [{ id: "infrastructure", label: "Infrastructure" }] : []),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex gap-8">
        {/* Sticky Scroll Spy Sidebar */}
        <CollegeSidebar sections={sections} />

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 space-y-12">
          {/* 1. Overview */}
          <section id="overview" className="scroll-mt-24 rounded-2xl border border-line bg-white p-6 shadow-sm">
            {college.image && (
              <div className="relative mb-6 aspect-[21/9] w-full overflow-hidden rounded-xl bg-brand-soft">
                <Image src={college.image} alt={college.name} fill className="object-cover" priority />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold capitalize text-brand">
                {college.instituteType} Institute
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-muted">
                {college.city}{college.state ? `, ${college.state}` : ""}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">{college.name}</h1>
            {college.shortAddress && <p className="mt-2 text-sm text-muted">{college.shortAddress}</p>}
          </section>

          {/* 2. Courses */}
          {courses.length > 0 && (
            <section id="courses" className="scroll-mt-24 rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-ink">Courses & Programs</h2>
              <div className="mt-6 divide-y divide-line">
                {courses.map((course) => (
                  <div key={course._id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-ink">{course.name}</h3>
                      {course.durationYears && (
                        <span className="text-xs text-muted">{course.durationYears} years</span>
                      )}
                    </div>
                    {course.eligibility && (
                      <p className="mt-1 text-sm text-muted">Eligibility: {course.eligibility}</p>
                    )}
                    {course.programs?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {course.programs.map((prog) => (
                          <span key={prog._id} className="rounded-md border border-line bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                            {prog.name} {prog.seats ? `(${prog.seats} seats)` : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. Fee Structure */}
          {feeStructures.length > 0 && (
            <section id="fees" className="scroll-mt-24 rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-ink">Fee Structure</h2>
              <div className="mt-6 space-y-4">
                {feeStructures.map((f) => (
                  <div key={f._id} className="rounded-xl border border-line p-4">
                    <p className="text-sm font-semibold text-slate-700">Academic Year: {f.academicYear}</p>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                      {f.tuitionPerYear && (
                        <div>
                          <span className="text-muted">Tuition / Year:</span>
                          <p className="font-semibold">{f.currency} {f.tuitionPerYear.toLocaleString()}</p>
                        </div>
                      )}
                      {f.totalCourseFee && (
                        <div>
                          <span className="text-muted">Total Fee:</span>
                          <p className="font-semibold">{f.currency} {f.totalCourseFee.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. Placements */}
          {placements.length > 0 && (
            <section id="placements" className="scroll-mt-24 rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-ink">Placements</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {placements.map((p) => (
                  <div key={p._id} className="rounded-xl border border-line p-4">
                    <p className="text-sm font-semibold text-brand">Year {p.academicYear}</p>
                    <div className="mt-3 space-y-1 text-sm">
                      {p.highestPackageLPA && <p>Highest: <span className="font-semibold">{p.highestPackageLPA} LPA</span></p>}
                      {p.averagePackageLPA && <p>Average: <span className="font-semibold">{p.averagePackageLPA} LPA</span></p>}
                      {p.studentsPlaced && p.studentsEligible && (
                        <p>Placed: <span className="font-semibold">{p.studentsPlaced} / {p.studentsEligible} students</span></p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. Infrastructure */}
          {infrastructure.length > 0 && (
            <section id="infrastructure" className="scroll-mt-24 rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-ink">Campus & Infrastructure</h2>
              <div className="mt-6 space-y-4">
                {infrastructure.map((inf) => (
                  <div key={inf._id} className="rounded-xl border border-line p-4">
                    <h3 className="font-semibold text-ink">{inf.title}</h3>
                    <p className="mt-1 text-sm text-muted">{inf.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function CollegeDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 animate-pulse">
      <div className="h-64 rounded-2xl bg-slate-100" />
      <div className="mt-8 h-8 w-64 rounded bg-slate-100" />
      <div className="mt-4 h-4 w-96 rounded bg-slate-100" />
    </div>
  );
}
