import express from "express";
import { signup, login, getProfile, getAllUsers, getAllAppointments, addDoctor, removeDoctor, getAnalytics } from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.get("/admin/users", auth, getAllUsers);
router.get("/admin/appointments", auth, getAllAppointments);
router.post("/admin/doctors", auth, addDoctor);
router.delete("/admin/doctors/:doctorId", auth, removeDoctor);
router.get("/admin/analytics", auth, getAnalytics);

export default router;
