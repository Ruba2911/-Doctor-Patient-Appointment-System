import mongoose, { Document } from "mongoose";
export interface ISpecialty extends Document {
    name: string;
    description: string;
    icon: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ISpecialty, {}, {}, {}, mongoose.Document<unknown, {}, ISpecialty, {}, {}> & ISpecialty & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Specialty.d.ts.map