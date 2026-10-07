export type InstituteType = "private" | "public" | "both";

// Only the fields the card needs.
export type CollegeCardData = {
  id: string;
  name: string;
  slug: string;
  city: string;
  state?: string;
  image?: string;
  instituteType: InstituteType;
};

// TEMPORARY: a local list so you can build the UI without a database.
// Delete this array when you connect a real database.
const colleges: CollegeCardData[] = [
  {
    id: "1",
    name: "Sample Institute of Technology",
    slug: "sample-institute-of-technology",
    city: "Kolkata",
    state: "West Bengal",
    instituteType: "private",
  },
  {
    id: "2",
    name: "Sample State University",
    slug: "sample-state-university",
    city: "Delhi",
    state: "Delhi",
    instituteType: "public",
  },
];

// Keep this function's name and shape the same. When you add a database,
// only the inside changes. The page and card will not need any edits.
export async function getColleges(filters: {
  city?: string;
}): Promise<CollegeCardData[]> {
  if (!filters.city) return colleges;

  return colleges.filter(
    (college) => college.city.toLowerCase() === filters.city!.toLowerCase(),
  );
}