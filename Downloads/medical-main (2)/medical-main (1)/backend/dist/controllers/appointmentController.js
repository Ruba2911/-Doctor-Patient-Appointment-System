"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPastAppointments = exports.getUpcomingAppointments = exports.cancelAppointment = exports.createAppointment = exports.getAppointments = void 0;
const Appointment_1 = __importDefault(require("../models/Appointment"));
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment_1.default.find({ patientId: req.userId }).sort({ appointmentDate: 1, appointmentTime: 1 });
        res.json({ appointments });
    }
    catch (error) {
        console.error("Get appointments error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getAppointments = getAppointments;
const createAppointment = async (req, res) => {
    try {
        const { doctorId, doctorName, doctorSpecialty, doctorImage, appointmentDate, appointmentTime, reason, notes, } = req.body;
        const appointment = new Appointment_1.default({
            patientId: req.userId,
            doctorId,
            doctorName,
            doctorSpecialty,
            doctorImage,
            appointmentDate,
            appointmentTime,
            reason,
            notes,
        });
        await appointment.save();
        res
            .status(201)
            .json({ message: "Appointment created successfully", appointment });
    }
    catch (error) {
        console.error("Create appointment error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.createAppointment = createAppointment;
const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment_1.default.findOneAndUpdate({ _id: id, patientId: req.userId }, { status: "cancelled" }, { new: true });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.json({ message: "Appointment cancelled successfully", appointment });
    }
    catch (error) {
        console.error("Cancel appointment error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.cancelAppointment = cancelAppointment;
const getUpcomingAppointments = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointments = await Appointment_1.default.find({
            patientId: req.userId,
            appointmentDate: { $gte: today },
            status: "scheduled",
        }).sort({ appointmentDate: 1, appointmentTime: 1 });
        res.json({ appointments });
    }
    catch (error) {
        console.error("Get upcoming appointments error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getUpcomingAppointments = getUpcomingAppointments;
const getPastAppointments = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointments = await Appointment_1.default.find({
            patientId: req.userId,
            $or: [
                { appointmentDate: { $lt: today } },
                { status: { $ne: "scheduled" } },
            ],
        }).sort({ appointmentDate: -1, appointmentTime: -1 });
        res.json({ appointments });
    }
    catch (error) {
        console.error("Get past appointments error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getPastAppointments = getPastAppointments;
//# sourceMappingURL=appointmentController.js.map