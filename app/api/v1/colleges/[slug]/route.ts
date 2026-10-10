import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { College } from "@/models/College";
import { Course } from "@/models/Course";
import { Program } from "@/models/Program";
import { Placement } from "@/models/Placement";
import { FeeStructure } from "@/models/FeeStructure";
import { Infrastructure } from "@/models/Infrastructure";

type Ctx = { params: Promise<{ slug: string }> };

function groupBy<T>(items: T[], key: (item: T) => string) {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    const list = map.get(k);
    if (list) list.push(item);
    else map.set(k, [item]);
  }
  return map;
}

function placementRate(eligible?: number, placed?: number) {
  if (!eligible || placed == null) return null;
  return Math.round((placed / eligible) * 1000) / 10;
}

// GET /api/v1/colleges/:slug
export async function GET(_req: NextRequest, { params }: Ctx) {
  const { slug } = await params;
  await connectDB();

  // 1. header
  const college = await College.findOne({ slug: slug.toLowerCase() }).lean();
  if (!college) {
    return NextResponse.json({ error: "College not found" }, { status: 404 });
  }

  // 2. courses + infrastructure
  const [courses, infrastructure] = await Promise.all([
    Course.find({ college: college._id }).sort({ name: 1 }).lean(),
    Infrastructure.find({ college: college._id }).sort({ createdAt: 1 }).lean(),
  ]);
  const courseIds = courses.map((c) => c._id);

  // 3. programs + fee structures (both hang off courses)
  const [programs, feeDocs] = await Promise.all([
    Program.find({ course: { $in: courseIds } }).sort({ name: 1 }).lean(),
    FeeStructure.find({ course: { $in: courseIds } }).lean(),
  ]);
  const programIds = programs.map((p) => p._id);

  // 4. placements (hang off programs)
  const placementDocs = await Placement.find({ program: { $in: programIds } })
    .sort({ academicYear: -1 })
    .lean();

  // ---------- shape the response per page section ----------
  const courseById = new Map(courses.map((c) => [String(c._id), c]));
  const courseRef = (id: unknown) => {
    const c = courseById.get(String(id));
    return c ? { _id: c._id, name: c.name, slug: c.slug } : null;
  };

  const programsByCourse = groupBy(programs, (p) => String(p.course));
  const placementsByProgram = groupBy(placementDocs, (p) => String(p.program));

  // Courses section (each course lists its programs)
  const courseList = courses.map((c) => ({
    _id: c._id,
    name: c.name,
    slug: c.slug,
    level: c.level,
    durationYears: c.durationYears,
    eligibility: c.eligibility,
    entranceExams: c.entranceExams,
    programs: (programsByCourse.get(String(c._id)) ?? []).map((p) => ({
      _id: p._id,
      name: p.name,
      shortName: p.shortName,
      slug: p.slug,
      seats: p.seats,
      accreditation: p.accreditation,
    })),
  }));

  // Fee structure section (one per course)
  const feeStructures = feeDocs.map((f) => ({
    _id: f._id,
    course: courseRef(f.course),
    academicYear: f.academicYear,
    currency: f.currency,
    tuitionPerYear: f.tuitionPerYear,
    totalCourseFee: f.totalCourseFee,
    items: f.items,
    notes: f.notes,
  }));

  // Infrastructure section
  const infrastructureList = infrastructure.map((i) => ({
    _id: i._id,
    title: i.title,
    description: i.description,
  }));

  // Placements section (grouped by program, newest year first)
  const placements = programs
    .filter((p) => placementsByProgram.has(String(p._id)))
    .map((p) => ({
      program: { _id: p._id, name: p.name, shortName: p.shortName, slug: p.slug },
      course: courseRef(p.course),
      records: placementsByProgram.get(String(p._id))!.map((r) => ({
        _id: r._id,
        academicYear: r.academicYear,
        studentsEligible: r.studentsEligible,
        studentsPlaced: r.studentsPlaced,
        placementRate: placementRate(r.studentsEligible, r.studentsPlaced),
        highestPackageLPA: r.highestPackageLPA,
        averagePackageLPA: r.averagePackageLPA,
        medianPackageLPA: r.medianPackageLPA,
        topRecruiters: r.topRecruiters,
      })),
    }));

  // Sidebar: only sections that have content; `id` doubles as the anchor id
  const sections = [
    { id: "courses", label: "Courses", count: courseList.length },
    { id: "fee-structure", label: "Fee Structure", count: feeStructures.length },
    { id: "infrastructure", label: "Infrastructure", count: infrastructureList.length },
    { id: "placements", label: "Placements", count: placements.length },
  ].filter((s) => s.count > 0);

  return NextResponse.json({
    data: {
      college: {
        _id: college._id,
        name: college.name,
        slug: college.slug,
        city: college.city,
        state: college.state,
        shortAddress: college.shortAddress,
        image: college.image,
        instituteType: college.instituteType,
        meta: college.meta,
      },
      sections,
      courses: courseList,
      feeStructures,
      infrastructure: infrastructureList,
      placements,
    },
  });
}