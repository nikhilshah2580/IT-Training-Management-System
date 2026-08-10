import express from "express";

import {
    createPayment,
    getPayments,
    getPayment,
    getMyPayments,
    updatePaymentStatus,
    deletePayment,
    getPaymentReport,
} from "../controllers/payment.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const paymentRoutes = express.Router();

// Student creates payment
paymentRoutes.post("/", verifyToken, authorizeRoles("student"), createPayment);
// Student gets own payments
paymentRoutes.get("/my-payments", verifyToken, authorizeRoles("student"), getMyPayments);
// Admin financial report
paymentRoutes.get("/report", verifyToken, authorizeRoles("admin"), getPaymentReport);
// Admin gets all payments
paymentRoutes.get("/", verifyToken, authorizeRoles("admin"), getPayments);
// Admin gets single payment
paymentRoutes.get("/:id", verifyToken, authorizeRoles("admin"), getPayment);
// Admin updates payment status
paymentRoutes.patch("/:id/status", verifyToken, authorizeRoles("admin"), updatePaymentStatus);
// Admin deletes payment
paymentRoutes.delete("/:id", verifyToken, authorizeRoles("admin"), deletePayment);

export default paymentRoutes;