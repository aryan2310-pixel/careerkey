import { Schema, model, models, type Model } from "mongoose";

export interface ILead {
  fullName: string;
  phone: string;
  city: string;
  course: string;
  questions?: string;
  status: "new" | "contacted" | "enrolled" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    course: { type: String, required: true, trim: true, maxlength: 50 },
    questions: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["new", "contacted", "enrolled", "closed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

export const Lead: Model<ILead> = models.Lead || model<ILead>("Lead", leadSchema);
