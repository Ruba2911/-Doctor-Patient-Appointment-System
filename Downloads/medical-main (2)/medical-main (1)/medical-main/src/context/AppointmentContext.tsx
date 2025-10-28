
import React, { createContext, useContext, useState, useEffect } from "react";
import { Appointment } from "../types";

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
  cancelAppointment: (id: string) => void;
  fetchAppointments: () => void;
  getUpcomingAppointments: () => Appointment[];
  getPastAppointments: () => Appointment[];
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const formattedAppointments = data.appointments.map(
          (apt: {
            _id: string;
            patientId: string;
            doctorId: string;
            doctorName: string;
            doctorSpecialty: string;
            doctorImage: string;
            appointmentDate: string;
            appointmentTime: string;
            status: string;
            reason: string;
            notes?: string;
          }) => ({
            id: apt._id,
            patientId: apt.patientId,
            doctorId: apt.doctorId,
            doctorName: apt.doctorName,
            doctorSpecialty: apt.doctorSpecialty,
            doctorImage: apt.doctorImage,
            appointmentDate: apt.appointmentDate.split("T")[0], // Format date
            appointmentTime: apt.appointmentTime,
            status: apt.status,
            reason: apt.reason,
            notes: apt.notes,
          })
        );
        setAppointments(formattedAppointments);
        localStorage.setItem(
          "appointments",
          JSON.stringify(formattedAppointments)
        );
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  useEffect(() => {
    const storedAppointments = localStorage.getItem("appointments");
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    }

    // Fetch from backend if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      fetchAppointments();
    }
  }, []);

  const addAppointment = async (appointment: Omit<Appointment, "id">) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await fetch("http://localhost:5000/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        doctorId: appointment.doctorId,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        reason: appointment.reason,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to book appointment");
    }

    const data = await response.json();
    const newAppointment: Appointment = {
      ...appointment,
      id: data.appointment._id,
    };

    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

    // Refresh appointments from backend after adding
    await fetchAppointments();
  };

  const cancelAppointment = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedAppointments = appointments.map((apt) =>
          apt.id === id ? { ...apt, status: "cancelled" as const } : apt
        );
        setAppointments(updatedAppointments);
        localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
      } else {
        throw new Error("Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      throw error;
    }
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments
      .filter((apt) => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= today && apt.status === "scheduled";
      })
      .sort(
        (a, b) =>
          new Date(a.appointmentDate).getTime() -
          new Date(b.appointmentDate).getTime()
      );
  };

  const getPastAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments
      .filter((apt) => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate < today || apt.status !== "scheduled";
      })
      .sort(
        (a, b) =>
          new Date(b.appointmentDate).getTime() -
          new Date(a.appointmentDate).getTime()
      );
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        addAppointment,
        cancelAppointment,
        fetchAppointments,
        getUpcomingAppointments,
        getPastAppointments,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useAppointments must be used within AppointmentProvider");
  }
  return context;
};
