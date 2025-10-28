"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Doctor_1 = __importDefault(require("../models/Doctor"));
const Specialty_1 = __importDefault(require("../models/Specialty"));
const router = express_1.default.Router();
// Get all doctors
router.get("/", async (req, res) => {
    try {
        const doctors = await Doctor_1.default.find();
        res.json({ doctors });
    }
    catch (error) {
        console.error("Get doctors error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
// Get doctor by ID
router.get("/:id", async (req, res) => {
    try {
        const doctor = await Doctor_1.default.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.json({ doctor });
    }
    catch (error) {
        console.error("Get doctor error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
// Get all specialties
router.get("/specialties/all", async (req, res) => {
    try {
        const specialties = await Specialty_1.default.find();
        res.json({ specialties });
    }
    catch (error) {
        console.error("Get specialties error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
//# sourceMappingURL=doctors.js.map