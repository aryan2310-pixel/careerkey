import { z } from "zod";
import { INSTITUTE_TYPES } from "@/models/College";
import { FEE_FREQUENCIES } from "@/models/FeeStructure";
import { COURSE_LEVELS } from "@/models/Course";

// ---------- shared pieces ----------
export const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

export const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(2)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only");

const text = (max = 200) => z.string().trim().min(1).max(max);
const academicYear = z.string().trim().regex(/^\d{4}-\d{2}$/, 'Use the format "2025-26"');


const imageUrl = z
  .string()
  .trim()
  .max(500)
  .regex(/^https?:\/\//i, "Image must be an http(s) URL");

// ---------- College ----------
const collegeBase = z.object({
  name: text(200),
  slug,
  city: text(100),
  state: text(100).optional(),
  shortAddress: text(300).optional(),
  image: imageUrl.optional(),
  instituteType: z.enum(INSTITUTE_TYPES),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const collegeCreateSchema = collegeBase.strict();
export const collegeUpdateSchema = collegeBase.partial().strict();

export const collegeQuerySchema = z.object({
  city: z.string().trim().min(1).optional(),
  type: z.enum(INSTITUTE_TYPES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

// ---------- Course ----------
export const courseCreateSchema = z
  .object({
    college: objectId,
    name: text(100),
    slug,
    level: z.enum(COURSE_LEVELS).optional(),
    durationYears: z.number().int().min(1).max(10).optional(),
    eligibility: text(500).optional(),
    entranceExams: z.array(text(50)).default([]),
  })
  .strict();

// ---------- Program ----------
export const programCreateSchema = z
  .object({
    course: objectId,
    name: text(200),
    shortName: text(30).optional(),
    slug,
    seats: z.number().int().min(0).optional(),
    accreditation: text(100).optional(),
  })
  .strict();

// ---------- Placement ----------
export const placementCreateSchema = z
  .object({
    program: objectId,
    academicYear,
    studentsEligible: z.number().int().min(0).optional(),
    studentsPlaced: z.number().int().min(0).optional(),
    highestPackageLPA: z.number().min(0).optional(),
    averagePackageLPA: z.number().min(0).optional(),
    medianPackageLPA: z.number().min(0).optional(),
    topRecruiters: z.array(text(100)).default([]),
  })
  .strict()
  .refine(
    (d) =>
      d.studentsPlaced == null ||
      d.studentsEligible == null ||
      d.studentsPlaced <= d.studentsEligible,
    { message: "studentsPlaced cannot exceed studentsEligible", path: ["studentsPlaced"] }
  );

// ---------- FeeStructure ----------
const feeItemSchema = z
  .object({
    label: text(100),
    amount: z.number().min(0),
    frequency: z.enum(FEE_FREQUENCIES),
    refundable: z.boolean().default(false),
  })
  .strict();

export const feeStructureCreateSchema = z
  .object({
    course: objectId,
    academicYear,
    currency: z.string().trim().length(3).toUpperCase().default("INR"),
    tuitionPerYear: z.number().min(0).optional(),
    totalCourseFee: z.number().min(0).optional(),
    items: z.array(feeItemSchema).default([]),
    notes: text(1000).optional(),
  })
  .strict();

// ---------- Infrastructure ----------
export const infrastructureCreateSchema = z
  .object({
    college: objectId,
    title: text(120),
    description: text(3000),
  })
  .strict();