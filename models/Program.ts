import { Schema, model, models, type Model, type Types } from "mongoose";
import type { IPlacement } from "./Placement";

export interface IProgram {
  course: Types.ObjectId;
  name: string; // "Computer Science & Engineering"
  shortName?: string; // "CSE"
  slug: string;
  seats?: number;
  accreditation?: string;
  // virtual
  placements?: IPlacement[];
  createdAt: Date;
  updatedAt: Date;
}

const programSchema = new Schema<IProgram>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    name: { type: String, required: true, trim: true },
    shortName: { type: String, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    seats: { type: Number, min: 0 },
    accreditation: { type: String, trim: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

programSchema.index({ course: 1, slug: 1 }, { unique: true });

programSchema.virtual("placements", {
  ref: "Placement",
  localField: "_id",
  foreignField: "program",
});

export const Program: Model<IProgram> =
  models.Program || model<IProgram>("Program", programSchema);