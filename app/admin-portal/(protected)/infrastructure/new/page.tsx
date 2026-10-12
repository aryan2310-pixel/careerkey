import Link from "next/link";
import { connectDB } from "@/lib/db";
import { College } from "@/models/College";
import InfrastructureForm from "./InfrastructureForm";

export default async function NewInfrastructurePage() {
  await connectDB();
  const colleges = await College.find().select("name slug").sort({ name: 1 }).lean();

  return (
    <>
      <Link href="/admin-portal/infrastructure" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to infrastructure
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">Add Campus Facility</h1>
      <p className="mt-1 text-sm text-slate-500">
        Add hostel, library, gym, or sports infrastructure info to a college.
      </p>

      <div className="mt-6 max-w-2xl">
        {colleges.length === 0 ? (
          <div className="rounded-xl border border-line bg-white p-6 text-sm text-muted">
            Please{" "}
            <Link href="/admin-portal/colleges/new" className="font-semibold text-brand underline">
              create a college first
            </Link>{" "}
            before adding infrastructure.
          </div>
        ) : (
          <InfrastructureForm
            colleges={colleges.map((c) => ({
              _id: String(c._id),
              name: c.name,
            }))}
          />
        )}
      </div>
    </>
  );
}
