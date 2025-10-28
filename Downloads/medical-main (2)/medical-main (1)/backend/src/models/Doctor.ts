import mongoose, { Document, Schema } from "mongoose";

export interface IDoctor extends Document {
  fullName: string;
  specialtyId: string;
  specialty: string;
  email: string;
  phone: string;
  bio: string;
  experienceYears: number;
  rating: number;
  consultationFee: number;
  imageUrl: string;
  availableDays: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    specialtyId: { type: String, required: true },
    specialty: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    bio: { type: String, required: true },
    experienceYears: { type: Number, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    consultationFee: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    availableDays: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDoctor>("Doctor", DoctorSchema);
