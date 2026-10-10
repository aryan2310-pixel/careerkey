import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IInfrastructure {
  college: Types.ObjectId;
  title: string; // "Hostel", "Central Library", "Sports Complex"
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const infrastructureSchema = new Schema<IInfrastructure>(
  {
    college: {
      type: Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Infrastructure: Model<IInfrastructure> =
  models.Infrastructure ||
  model<IInfrastructure>("Infrastructure", infrastructureSchema);