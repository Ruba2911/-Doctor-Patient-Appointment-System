import { Request, Response } from "express";

// Mock appointment data (in-memory storage)
export let appointments: any[] = [];

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const userAppointments = appointments.filter(a => a.patientId === req.userId).sort(
      (a, b) => new Date(a.appointmentDate + ' ' + a.appointmentTime).getTime() -
               new Date(b.appointmentDate + ' ' + b.appointmentTime).getTime()
    );

    res.json({ appointments: userAppointments });
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { doctorId, doctorName, doctorSpecialty, doctorImage, appointmentDate, appointmentTime, reason, notes } = req.body;

    console.log("Creating appointment with data:", {
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

    const appointment = {
      id: Date.now().toString(),
      patientId: req.userId,
      doctorId,
      doctorName,
      doctorSpecialty,
      doctorImage,
      appointmentDate,
      appointmentTime,
      status: 'scheduled',
      reason,
      notes,
      createdAt: new Date().toISOString(),
    };

    appointments.push(appointment);
    console.log("Appointment saved:", appointment);
    res
      .status(201)
      .json({
        message: "Appointment created successfully",
        appointment,
      });
  } catch (error) {
    console.error("Create appointment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointmentIndex = appointments.findIndex(
      a => a.id === id && a.patientId === req.userId
    );

    if (appointmentIndex === -1) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointments[appointmentIndex].status = "cancelled";

    res.json({ message: "Appointment cancelled successfully", appointment: appointments[appointmentIndex] });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUpcomingAppointments = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingAppointments = appointments.filter(a =>
      a.patientId === req.userId &&
      new Date(a.appointmentDate) >= today &&
      a.status === "scheduled"
    ).sort((a, b) => new Date(a.appointmentDate + ' ' + a.appointmentTime).getTime() -
                     new Date(b.appointmentDate + ' ' + b.appointmentTime).getTime());

    res.json({ appointments: upcomingAppointments });
  } catch (error) {
    console.error("Get upcoming appointments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPastAppointments = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastAppointments = appointments.filter(a =>
      a.patientId === req.userId &&
      (new Date(a.appointmentDate) < today || a.status !== "scheduled")
    ).sort((a, b) => new Date(b.appointmentDate + ' ' + b.appointmentTime).getTime() -
                     new Date(a.appointmentDate + ' ' + a.appointmentTime).getTime());

    res.json({ appointments: pastAppointments });
  } catch (error) {
    console.error("Get past appointments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
