import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Placement } from "@/models/Placement";
import { Program } from "@/models/Program";
import "@/models/Course";
import PlacementTable from "./PlacementTable";

export default async function ManagePlacementsPage() {
  await connectDB();
  const placements = await Placement.find()
    .populate({
      path: "program",
      populate: { path: "course", select: "name" },
    })
    .sort({ academicYear: -1 })
    .lean();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin-portal" className="text-sm text-slate-500 hover:text-slate-900">
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">Manage Placements</h1>
          <p className="mt-1 text-sm text-slate-500">
            {placements.length} placement records across programs.
          </p>
        </div>
        <Link
          href="/admin-portal/placements/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add placement
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-line bg-white shadow-sm overflow-hidden">
        <PlacementTable
          initialPlacements={placements.map((p: any) => ({
            _id: String(p._id),
            courseName: p.program?.course?.name
              ? `${p.program.course.name} - ${p.program.name}`
              : (p.program?.name ?? "General"),
            academicYear: p.academicYear,
            highestPackageLPA: p.highestPackageLPA,
            averagePackageLPA: p.averagePackageLPA,
            placedStats:
              p.studentsPlaced && p.studentsEligible
                ? `${p.studentsPlaced} / ${p.studentsEligible}`
                : undefined,
          }))}
        />
      </div>
    </>
  );
}
