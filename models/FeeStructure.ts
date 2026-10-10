import { Schema, model, models, type Model, type Types } from "mongoose";

export const FEE_FREQUENCIES = ["one-time", "per-year", "per-semester"] as const;

export interface IFeeItem {
  label: string;
  amount: number;
  frequency: (typeof FEE_FREQUENCIES)[number];
  refundable: boolean;
}

export interface IFeeStructure {
  course: Types.ObjectId;
  academicYear: string; // "2026-27"
  currency: string;
  tuitionPerYear?: number;
  totalCourseFee?: number;
  items: IFeeItem[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const feeItemSchema = new Schema<IFeeItem>(
  {
    label: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    frequency: { type: String, enum: FEE_FREQUENCIES, required: true },
    refundable: { type: Boolean, default: false },
  },
  { _id: false }
);

const feeStructureSchema = new Schema<IFeeStructure>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true, unique: true },
    academicYear: { type: String, required: true, trim: true },
    currency: { type: String, default: "INR" },
    tuitionPerYear: { type: Number, min: 0 },
    totalCourseFee: { type: Number, min: 0 },
    items: [feeItemSchema],
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export const FeeStructure: Model<IFeeStructure> =
  models.FeeStructure || model<IFeeStructure>("FeeStructure", feeStructureSchema);