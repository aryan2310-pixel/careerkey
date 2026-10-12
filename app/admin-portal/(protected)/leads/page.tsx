import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import LeadTable from "./LeadTable";

export default async function ManageLeadsPage() {
  await connectDB();
  const rawLeads = await Lead.find().sort({ createdAt: -1 }).lean();

  const leads = rawLeads.map((l) => ({
    _id: String(l._id),
    fullName: l.fullName,
    phone: l.phone,
    city: l.city,
    course: l.course,
    questions: l.questions || "",
    status: l.status,
    createdAt: l.createdAt.toISOString(),
  }));

  const newCount = leads.filter((l) => l.status === "new").length;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin-portal" className="text-sm text-slate-500 hover:text-slate-900">
            ← Back to dashboard
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Student Leads & Inquiries</h1>
            {newCount > 0 && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                {newCount} new
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {leads.length} total inquiries received from counselling forms.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-line bg-white shadow-sm overflow-hidden">
        <LeadTable initialLeads={leads} />
      </div>
    </>
  );
}
