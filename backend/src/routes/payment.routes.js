import express from "express";

import {
  createPayment,
  initiateEsewaPayment,
  initiateKhaltiPayment,
  verifyEsewaPayment,
  verifyKhaltiPayment,
  getPayments,
  getPayment,
  getMyPayments,
  downloadPaymentInvoice,
  deletePayment,
  getPaymentReport,
} from "../controllers/payment.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const paymentRoutes = express.Router();

// Student creates payment
paymentRoutes.post("/", verifyToken, authorizeRoles("student"), createPayment);
paymentRoutes.post(
  "/esewa/initiate",
  verifyToken,
  authorizeRoles("student"),
  initiateEsewaPayment,
);
paymentRoutes.post(
  "/esewa/verify",
  verifyToken,
  authorizeRoles("student"),
  verifyEsewaPayment,
);
paymentRoutes.post(
  "/khalti/initiate",
  verifyToken,
  authorizeRoles("student"),
  initiateKhaltiPayment,
);
paymentRoutes.post(
  "/khalti/verify",
  verifyToken,
  authorizeRoles("student"),
  verifyKhaltiPayment,
);
// Student gets own payments
paymentRoutes.get(
  "/my-payments",
  verifyToken,
  authorizeRoles("student"),
  getMyPayments,
);
// Admin financial report
paymentRoutes.get(
  "/report",
  verifyToken,
  authorizeRoles("admin"),
  getPaymentReport,
);
paymentRoutes.get(
  "/:id/invoice",
  verifyToken,
  authorizeRoles("student", "admin"),
  downloadPaymentInvoice,
);

// Admin gets all payments
paymentRoutes.get("/", verifyToken, authorizeRoles("admin"), getPayments);
// Admin gets single payment
paymentRoutes.get("/:id", verifyToken, authorizeRoles("admin"), getPayment);
// Admin deletes payment
paymentRoutes.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  deletePayment,
);

export default paymentRoutes;
