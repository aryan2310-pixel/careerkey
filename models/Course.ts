import { Schema, model, models, type Model, type Types } from "mongoose";
import type { IProgram } from "./Program";
import type { IFeeStructure } from "./FeeStructure";

export const COURSE_LEVELS = ["diploma", "undergraduate", "postgraduate", "doctorate"] as const;

export interface ICourse {
  college: Types.ObjectId;
  name: string; // "BTech", "MTech", "MBA"
  slug: string;
  level?: (typeof COURSE_LEVELS)[number];
  durationYears?: number;
  eligibility?: string;
  entranceExams: string[];
  // virtuals
  programs?: IProgram[];
  feeStructure?: IFeeStructure;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    college: { type: Schema.Types.ObjectId, ref: "College", required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    level: { type: String, enum: COURSE_LEVELS },
    durationYears: { type: Number, min: 1 },
    eligibility: { type: String, trim: true },
    entranceExams: [{ type: String, trim: true }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

courseSchema.index({ college: 1, slug: 1 }, { unique: true });

courseSchema.virtual("programs", {
  ref: "Program",
  localField: "_id",
  foreignField: "course",
});

courseSchema.virtual("feeStructure", {
  ref: "FeeStructure",
  localField: "_id",
  foreignField: "course",
  justOne: true,
});

export const Course: Model<ICourse> =
  models.Course || model<ICourse>("Course", courseSchema);