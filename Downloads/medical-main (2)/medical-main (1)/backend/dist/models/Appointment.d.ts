import mongoose, { Document } from "mongoose";
export interface IAppointment extends Document {
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    doctorName: string;
    doctorSpecialty: string;
    doctorImage: string;
    appointmentDate: Date;
    appointmentTime: string;
    status: "scheduled" | "completed" | "cancelled";
    reason: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IAppointment, {}, {}, {}, mongoose.Document<unknown, {}, IAppointment, {}, {}> & IAppointment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Appointment.d.ts.map