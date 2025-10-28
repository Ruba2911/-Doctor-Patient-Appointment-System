import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Mock user data (in-memory storage)
let users: any[] = [
  {
    id: 'admin-1',
    email: 'admin@company.com',
    password: '123qwe',
    fullName: 'Admin User',
    phone: '',
    role: 'admin'
  }
];

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, phone } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user (no password hashing for simplicity)
    const user = {
      id: Date.now().toString(),
      email,
      password,
      fullName,
      phone,
    };

    users.push(user);

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role || 'user',
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = users.find(u => u.id === req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json({ users: usersWithoutPasswords });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    // Import appointments from appointmentController
    const { appointments } = require('./appointmentController');
    // Link appointments with users
    const appointmentsWithUsers = appointments.map((appointment: any) => {
      const user = users.find(u => u.id === appointment.patientId);
      return {
        ...appointment,
        patientName: user ? user.fullName : 'Unknown',
        patientEmail: user ? user.email : 'Unknown',
      };
    });
    res.json({ appointments: appointmentsWithUsers });
  } catch (error) {
    console.error("Get all appointments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addDoctor = async (req: Request, res: Response) => {
  try {
    const { fullName, specialty, experienceYears, consultationFee, imageUrl, availableDays, rating, totalReviews, education, languages, about } = req.body;

    // Create doctor
    const doctor = {
      id: Date.now().toString(),
      fullName,
      specialty,
      experienceYears,
      consultationFee,
      imageUrl,
      availableDays,
      rating,
      totalReviews,
      education,
      languages,
      about,
    };

    // In a real app, this would be saved to database
    // For now, we'll just return success
    res.status(201).json({
      message: "Doctor added successfully",
      doctor,
    });
  } catch (error) {
    console.error("Add doctor error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeDoctor = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;

    // In a real app, this would remove from database
    // For now, we'll just return success
    res.json({
      message: "Doctor removed successfully",
      doctorId,
    });
  } catch (error) {
    console.error("Remove doctor error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    // Import appointments from appointmentController
    const { appointments } = require('./appointmentController');

    const totalAppointments = appointments.length;
    const scheduledAppointments = appointments.filter((a: any) => a.status === 'scheduled').length;
    const cancelledAppointments = appointments.filter((a: any) => a.status === 'cancelled').length;
    const completedAppointments = appointments.filter((a: any) => a.status === 'completed').length;

    // Group by specialty
    const specialtyStats = appointments.reduce((acc: any, apt: any) => {
      const specialty = apt.doctorSpecialty;
      if (!acc[specialty]) {
        acc[specialty] = { total: 0, scheduled: 0, cancelled: 0, completed: 0 };
      }
      acc[specialty].total++;
      if (apt.status === 'scheduled') acc[specialty].scheduled++;
      if (apt.status === 'cancelled') acc[specialty].cancelled++;
      if (apt.status === 'completed') acc[specialty].completed++;
      return acc;
    }, {});

    // Monthly stats (simplified)
    const monthlyStats = {
      currentMonth: {
        appointments: totalAppointments,
        revenue: totalAppointments * 150, // Average fee
      },
      previousMonth: {
        appointments: Math.floor(totalAppointments * 0.8),
        revenue: Math.floor(totalAppointments * 0.8) * 150,
      }
    };

    res.json({
      analytics: {
        totalAppointments,
        scheduledAppointments,
        cancelledAppointments,
        completedAppointments,
        specialtyStats,
        monthlyStats,
        totalUsers: users.length,
        activeUsers: users.filter(u => u.role !== 'admin').length,
      }
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
