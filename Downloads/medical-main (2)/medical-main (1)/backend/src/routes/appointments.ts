import express from "express";
import {
  getAppointments,
  createAppointment,
  cancelAppointment,
  getUpcomingAppointments,
  getPastAppointments,
} from "../controllers/appointmentController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.use(auth); // All appointment routes require authentication

router.get("/", getAppointments);
router.post("/", createAppointment);
router.put("/:id/cancel", cancelAppointment);
router.get("/upcoming", getUpcomingAppointments);
router.get("/past", getPastAppointments);

export default router;
