import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { College } from "@/models/College";
import CollegeEditForm from "./CollegeEditForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditCollegePage({ params }: Props) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  await connectDB();
  const college = await College.findById(id).lean();
  if (!college) notFound();

  return (
    <>
      <Link href="/admin-portal/colleges" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to colleges
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">Edit College</h1>
      <p className="mt-1 text-sm text-slate-500">
        Update details and profile information for {college.name}.
      </p>

      <div className="mt-6 max-w-2xl">
        <CollegeEditForm
          college={{
            _id: String(college._id),
            name: college.name,
            slug: college.slug,
            city: college.city,
            state: college.state ?? "",
            shortAddress: college.shortAddress ?? "",
            image: college.image ?? "",
            instituteType: college.instituteType,
          }}
        />
      </div>
    </>
  );
}
