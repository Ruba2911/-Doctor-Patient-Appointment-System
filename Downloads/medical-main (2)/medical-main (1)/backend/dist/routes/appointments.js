"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointmentController_1 = require("../controllers/appointmentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.auth); // All appointment routes require authentication
router.get("/", appointmentController_1.getAppointments);
router.post("/", appointmentController_1.createAppointment);
router.put("/:id/cancel", appointmentController_1.cancelAppointment);
router.get("/upcoming", appointmentController_1.getUpcomingAppointments);
router.get("/past", appointmentController_1.getPastAppointments);
exports.default = router;
//# sourceMappingURL=appointments.js.map