import Link from "next/link";
import CollegeForm from "./CollegeForm";

export default function NewCollegePage() {
  return (
    <>
      <Link href="/admin-portal" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to dashboard
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">Add college</h1>
      <p className="mt-1 text-sm text-slate-500">
        Create the college first. You can add its courses, fees, infrastructure and placements afterwards.
      </p>
      <div className="mt-6 max-w-2xl">
        <CollegeForm />
      </div>
    </>
  );
}