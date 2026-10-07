export type CourseLevel = "Undergraduate" | "Postgraduate";

export type CourseData = {
  slug: string;
  name: string; // short name, e.g. "BTech" (matches the college filter values)
  fullName: string;
  level: CourseLevel;
  duration: string;
  description: string;
};

// TEMPORARY: a local list so you can build the UI without a database.
// Replace the inside of getCourses() when you connect one.
const courses: CourseData[] = [
  {
    slug: "btech",
    name: "BTech",
    fullName: "Bachelor of Technology",
    level: "Undergraduate",
    duration: "4 years",
    description: "Engineering degree covering core science and a chosen branch such as computer science or mechanical.",
  },
  {
    slug: "bba",
    name: "BBA",
    fullName: "Bachelor of Business Administration",
    level: "Undergraduate",
    duration: "3 years",
    description: "Introduction to management, marketing, finance and operations.",
  },
  {
    slug: "bca",
    name: "BCA",
    fullName: "Bachelor of Computer Applications",
    level: "Undergraduate",
    duration: "3 years",
    description: "Programming, databases and software development fundamentals.",
  },
  {
    slug: "mtech",
    name: "MTech",
    fullName: "Master of Technology",
    level: "Postgraduate",
    duration: "2 years",
    description: "Advanced study and research in a specialised engineering field.",
  },
  {
    slug: "mba",
    name: "MBA",
    fullName: "Master of Business Administration",
    level: "Postgraduate",
    duration: "2 years",
    description: "Management training with specialisations such as finance, marketing and HR.",
  },
];

export async function getCourses(): Promise<CourseData[]> {
  return courses;
}