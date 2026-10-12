import { Suspense } from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth";

const sections = [
  {
    title: "Colleges & Infrastructure",
    actions: [
      { href: "/admin-portal/colleges", title: "Manage Colleges", desc: "View, edit, or delete college profiles" },
      { href: "/admin-portal/colleges/new", title: "+ Add College", desc: "Create a new institute profile" },
      { href: "/admin-portal/infrastructure", title: "Campus & Infrastructure", desc: "Manage hostel, library, and lab facilities" },
      { href: "/admin-portal/infrastructure/new", title: "+ Add Facility", desc: "Add infrastructure details to a college" },
    ],
  },
  {
    title: "Courses & Fees",
    actions: [
      { href: "/admin-portal/courses", title: "Manage Courses", desc: "View, filter, or delete degrees and courses" },
      { href: "/admin-portal/courses/new", title: "+ Add Course", desc: "Add BTech, MBA, etc. to a college" },
      { href: "/admin-portal/programs", title: "Manage Programs", desc: "Manage specializations and seat counts" },
      { href: "/admin-portal/programs/new", title: "+ Add Program", desc: "Add branches like CSE, ECE to a course" },
      { href: "/admin-portal/fee-structures", title: "Fee Structures", desc: "Manage tuition and full course costs" },
      { href: "/admin-portal/fee-structures/new", title: "+ Add Fee Structure", desc: "Record annual tuition and total costs" },
    ],
  },
  {
    title: "Placements & Knowledge Base",
    actions: [
      { href: "/admin-portal/placements", title: "Manage Placements", desc: "View and manage packages and recruiters" },
      { href: "/admin-portal/placements/new", title: "+ Add Placements", desc: "Record verified salary and placed students" },
      { href: "/admin-portal/insights", title: "Manage Insights", desc: "View, edit, or delete published guides" },
      { href: "/admin-portal/insights/new", title: "+ Write Guide", desc: "Publish admission guides and articles" },
    ],
  },
];

async function Greeting() {
  const session = await getSession();
  return (
    <p className="mt-1 text-sm text-slate-500">
      Welcome back{session?.name ? `, ${session.name}` : ""}.
    </p>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Suspense fallback={<p className="mt-1 h-5" />}>
          <Greeting />
        </Suspense>
      </div>

      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            {section.title}
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {section.actions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group rounded-xl border border-line bg-white p-5 transition hover:border-slate-900 shadow-sm"
              >
                <h3 className="font-medium text-ink group-hover:text-brand">{a.title}</h3>
                <p className="mt-1 text-xs text-muted leading-relaxed">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}