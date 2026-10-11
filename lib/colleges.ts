import { connectDB } from "@/lib/db";
import { College, type InstituteType } from "@/models/College";
import { Course } from "@/models/Course";
import { Program } from "@/models/Program";
import { Placement } from "@/models/Placement";
import { FeeStructure } from "@/models/FeeStructure";
import { Infrastructure } from "@/models/Infrastructure";

export type { InstituteType };

export type CollegeCardData = {
  id: string;
  name: string;
  slug: string;
  city: string;
  state?: string;
  image?: string;
  instituteType: InstituteType;
};

export type CollegeFilters = {
  city?: string;
  state?: string;
  course?: string;
};

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function getColleges(filters: CollegeFilters = {}): Promise<CollegeCardData[]> {
  await connectDB();

  const query: Record<string, unknown> = {};

  if (filters.city) {
    query.city = new RegExp(`^${escapeRegex(filters.city)}$`, "i");
  }

  if (filters.state) {
    query.state = new RegExp(`^${escapeRegex(filters.state)}$`, "i");
  }

  // If a course filter is selected, find colleges that offer it
  if (filters.course) {
    const courseRegex = new RegExp(`^${escapeRegex(filters.course)}$`, "i");
    const matchingCourses = await Course.find({
      $or: [{ name: courseRegex }, { slug: filters.course.toLowerCase() }],
    })
      .select("college")
      .lean();

    const collegeIds = matchingCourses.map((c) => c.college);
    query._id = { $in: collegeIds };
  }

  const docs = await College.find(query).sort({ createdAt: -1 }).lean();

  return docs.map((doc) => ({
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    city: doc.city,
    state: doc.state,
    image: doc.image,
    instituteType: doc.instituteType,
  }));
}

export async function getCollegeBySlug(slug: string) {
  await connectDB();

  const college = await College.findOne({ slug: slug.toLowerCase() }).lean();
  if (!college) return null;

  const [courses, infrastructure] = await Promise.all([
    Course.find({ college: college._id }).sort({ name: 1 }).lean(),
    Infrastructure.find({ college: college._id }).sort({ createdAt: 1 }).lean(),
  ]);

  const courseIds = courses.map((c) => c._id);

  const [programs, feeStructures] = await Promise.all([
    Program.find({ course: { $in: courseIds } }).sort({ name: 1 }).lean(),
    FeeStructure.find({ course: { $in: courseIds } }).lean(),
  ]);

  const programIds = programs.map((p) => p._id);
  const placements = await Placement.find({ program: { $in: programIds } })
    .sort({ academicYear: -1 })
    .lean();

  return {
    college: {
      ...college,
      _id: String(college._id),
    },
    courses: courses.map((c) => ({
      ...c,
      _id: String(c._id),
      programs: programs
        .filter((p) => String(p.course) === String(c._id))
        .map((p) => ({ ...p, _id: String(p._id) })),
    })),
    feeStructures: feeStructures.map((f) => ({ ...f, _id: String(f._id) })),
    infrastructure: infrastructure.map((i) => ({ ...i, _id: String(i._id) })),
    placements: placements.map((pl) => ({ ...pl, _id: String(pl._id) })),
  };
}
