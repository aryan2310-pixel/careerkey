import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { Program } from "@/models/Program";
import ProgramEditForm from "./ProgramEditForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditProgramPage({ params }: Props) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  await connectDB();
  const program = await Program.findById(id).lean();
  if (!program) notFound();

  return (
    <>
      <Link href="/admin-portal/programs" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to programs
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">Edit Program / Branch</h1>
      <p className="mt-1 text-sm text-slate-500">Update specialization name, seats, or slug.</p>

      <div className="mt-6 max-w-2xl">
        <ProgramEditForm
          program={{
            _id: String(program._id),
            name: program.name,
            shortName: program.shortName,
            slug: program.slug,
            seats: program.seats,
            accreditation: program.accreditation,
          }}
        />
      </div>
    </>
  );
}
