import { Schema, model, models, type Model } from "mongoose";

export interface IInsight {
  title: string;
  slug: string;
  tag: string;
  readTime?: string;
  summary: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const insightSchema = new Schema<IInsight>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tag: { type: String, required: true, trim: true },
    readTime: { type: String, trim: true, default: "4 min read" },
    summary: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Insight: Model<IInsight> =
  models.Insight || model<IInsight>("Insight", insightSchema);
