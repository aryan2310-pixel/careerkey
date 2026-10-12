import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Program } from "@/models/Program";
import "@/models/Course";
import ProgramTable from "./ProgramTable";

export default async function ManageProgramsPage() {
  await connectDB();
  const programs = await Program.find()
    .populate("course", "name")
    .sort({ name: 1 })
    .lean();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin-portal" className="text-sm text-slate-500 hover:text-slate-900">
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">Manage Programs</h1>
          <p className="mt-1 text-sm text-slate-500">{programs.length} programs recorded.</p>
        </div>
        <Link
          href="/admin-portal/programs/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add program
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-line bg-white shadow-sm overflow-hidden">
        <ProgramTable
          initialPrograms={programs.map((p: any) => ({
            _id: String(p._id),
            name: p.name,
            shortName: p.shortName,
            courseName: p.course?.name ?? "General",
            seats: p.seats,
          }))}
        />
      </div>
    </>
  );
}
