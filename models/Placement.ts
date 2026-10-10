import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IPlacement {
  program: Types.ObjectId;
  academicYear: string; // "2025-26"
  studentsEligible?: number;
  studentsPlaced?: number;
  highestPackageLPA?: number;
  averagePackageLPA?: number;
  medianPackageLPA?: number;
  topRecruiters: string[];
  createdAt: Date;
  updatedAt: Date;
}

const placementSchema = new Schema<IPlacement>(
  {
    program: { type: Schema.Types.ObjectId, ref: "Program", required: true, index: true },
    academicYear: { type: String, required: true, trim: true },
    studentsEligible: { type: Number, min: 0 },
    studentsPlaced: { type: Number, min: 0 },
    highestPackageLPA: { type: Number, min: 0 },
    averagePackageLPA: { type: Number, min: 0 },
    medianPackageLPA: { type: Number, min: 0 },
    topRecruiters: [{ type: String, trim: true }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

placementSchema.virtual("placementRate").get(function () {
  if (!this.studentsEligible || this.studentsPlaced == null) return undefined;
  return Math.round((this.studentsPlaced / this.studentsEligible) * 1000) / 10;
});

placementSchema.index({ program: 1, academicYear: 1 }, { unique: true });

export const Placement: Model<IPlacement> =
  models.Placement || model<IPlacement>("Placement", placementSchema);