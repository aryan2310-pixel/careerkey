import { Schema, model, models, type Model } from "mongoose";
import type { ICourse } from "./Course";
import type { IInfrastructure } from "./Infrastructure";

export const INSTITUTE_TYPES = ["private", "public", "both"] as const;
export type InstituteType = (typeof INSTITUTE_TYPES)[number];

export interface ICollege {
  name: string;
  slug: string;
  city: string;
  state?: string;
  shortAddress?: string;
  image?: string;
  instituteType: InstituteType;
  meta?: unknown;
  // virtuals (only present when populated)
  courses?: ICourse[];
  infrastructure?: IInfrastructure[];
  createdAt: Date;
  updatedAt: Date;
}

const collegeSchema = new Schema<ICollege>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    state: { type: String, trim: true },
    shortAddress: { type: String, trim: true },
    image: { type: String, trim: true },
    instituteType: { type: String, enum: INSTITUTE_TYPES, required: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

collegeSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "college",
});

collegeSchema.virtual("infrastructure", {
  ref: "Infrastructure",
  localField: "_id",
  foreignField: "college",
});

export const College: Model<ICollege> =
  models.College || model<ICollege>("College", collegeSchema);