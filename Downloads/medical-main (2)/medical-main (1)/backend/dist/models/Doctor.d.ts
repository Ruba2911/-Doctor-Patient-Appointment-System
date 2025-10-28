import mongoose, { Document } from "mongoose";
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
declare const _default: mongoose.Model<IDoctor, {}, {}, {}, mongoose.Document<unknown, {}, IDoctor, {}, {}> & IDoctor & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Doctor.d.ts.map