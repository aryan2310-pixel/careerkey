import { Suspense } from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth";

// add or remove cards here as you build more admin features
const actions = [
  { href: "/admin-portal/colleges/new", title: "Add college", desc: "Create a new college profile" },
  { href: "/admin-portal/colleges", title: "Manage colleges", desc: "Edit or delete existing colleges" },
  { href: "/admin-portal/courses/new", title: "Add course", desc: "Add courses and programs to a college" },
  { href: "/admin-portal/placements/new", title: "Add placements", desc: "Record placement stats per program" },
  { href: "/admin-portal/insights/new", title: "Add insight", desc: "Publish a guide or article" },
];

// reads the cookie, so it must sit inside Suspense
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
    <>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <Suspense fallback={<p className="mt-1 h-5" />}>
        <Greeting />
      </Suspense>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="rounded-xl border border-line bg-white p-5 transition hover:border-slate-900"
          >
            <h2 className="font-medium">{a.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{a.desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
}