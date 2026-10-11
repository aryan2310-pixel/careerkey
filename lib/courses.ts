import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";

export type CourseLevel = "Undergraduate" | "Postgraduate" | "Diploma" | "Doctorate";

export type CourseData = {
  slug: string;
  name: string;
  fullName: string;
  level: CourseLevel;
  duration: string;
  description: string;
};

const levelMap: Record<string, CourseLevel> = {
  undergraduate: "Undergraduate",
  postgraduate: "Postgraduate",
  diploma: "Diploma",
  doctorate: "Doctorate",
};

export async function getCourses(): Promise<CourseData[]> {
  await connectDB();
  const docs = await Course.find().sort({ name: 1 }).lean();

  // Deduplicate by course name so we only display unique courses in the catalog
  const seen = new Set<string>();
  const list: CourseData[] = [];

  for (const doc of docs) {
    const key = doc.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    list.push({
      slug: doc.slug,
      name: doc.name,
      fullName: doc.name,
      level: levelMap[doc.level ?? "undergraduate"] ?? "Undergraduate",
      duration: doc.durationYears
        ? `${doc.durationYears} ${doc.durationYears === 1 ? "year" : "years"}`
        : "N/A",
      description: doc.eligibility || "Refer to college details for eligibility and admission criteria.",
    });
  }

  return list;
}