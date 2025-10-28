import { Request, Response } from "express";
export declare const getAppointments: (req: Request, res: Response) => Promise<void>;
export declare const createAppointment: (req: Request, res: Response) => Promise<void>;
export declare const cancelAppointment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUpcomingAppointments: (req: Request, res: Response) => Promise<void>;
export declare const getPastAppointments: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=appointmentController.d.ts.map