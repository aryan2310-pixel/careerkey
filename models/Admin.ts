import { Schema, model, models, type Model } from "mongoose";

export const ADMIN_ROLES = ["admin", "editor"] as const;

export interface IAdmin {
  name: string;
  email: string;
  passwordHash: string;
  role: (typeof ADMIN_ROLES)[number];
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false }, // never returned by default
    role: { type: String, enum: ADMIN_ROLES, default: "admin" },
  },
  { timestamps: true }
);

export const Admin: Model<IAdmin> =
  models.Admin || model<IAdmin>("Admin", adminSchema);