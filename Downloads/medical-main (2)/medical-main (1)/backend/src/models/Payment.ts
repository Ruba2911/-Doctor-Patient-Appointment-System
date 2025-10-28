import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  paymentId: string;
  appointmentData: {
    patientId: string;
    doctorId: string;
    doctorName: string;
    doctorSpecialty: string;
    doctorImage: string;
    appointmentDate: string;
    appointmentTime: string;
    reason: string;
    amount: number;
  };
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    paymentId: { type: String, required: true, unique: true },
    appointmentData: {
      patientId: { type: String, required: true },
      doctorId: { type: String, required: true },
      doctorName: { type: String, required: true },
      doctorSpecialty: { type: String, required: true },
      doctorImage: { type: String, required: true },
      appointmentDate: { type: String, required: true },
      appointmentTime: { type: String, required: true },
      reason: { type: String, required: true },
      amount: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPayment>("Payment", PaymentSchema);
