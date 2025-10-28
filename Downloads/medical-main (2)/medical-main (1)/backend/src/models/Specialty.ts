import mongoose, { Document, Schema } from "mongoose";

export interface ISpecialty extends Document {
  name: string;
  description: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

const SpecialtySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISpecialty>("Specialty", SpecialtySchema);
