import { Router } from "express";
import {
  createPayment,
  getPayment,
  updatePaymentStatus,
  confirmPayment,
  cancelPayment,
  renderPaymentPage,
} from "../controllers/paymentController";

const router = Router();

router.post("/", createPayment);
router.get("/:paymentId", getPayment);
router.put("/:paymentId", updatePaymentStatus);
router.post("/confirm/:paymentId", confirmPayment);
router.post("/cancel/:paymentId", cancelPayment);
router.get("/page/:paymentId", renderPaymentPage);

export default router;
