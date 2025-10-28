export interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Doctor {
  id: string;
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
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  role?: 'user' | 'admin';
}
