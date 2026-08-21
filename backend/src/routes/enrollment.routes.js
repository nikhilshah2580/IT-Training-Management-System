import express from "express";

import {
  createEnrollment,
  getEnrollments,
  getEnrollment,
  getMyEnrollments,
  getInstructorEnrollments,
  updateEnrollmentStatus,
  updateEnrollmentPaymentStatus,
  updateEnrollmentProgress,
  cancelEnrollment,
} from "../controllers/enrollment.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const enrollmentRoutes = express.Router();

// Student enrolls in a course
enrollmentRoutes.post(
  "/",
  verifyToken,
  authorizeRoles("student"),
  createEnrollment,
);

// Student views own enrollments
enrollmentRoutes.get(
  "/my",
  verifyToken,
  authorizeRoles("student"),
  getMyEnrollments,
);

// Instructor views students enrolled
// only in their own courses
enrollmentRoutes.get(
  "/instructor",
  verifyToken,
  authorizeRoles("instructor"),
  getInstructorEnrollments,
);

// Admin gets all enrollments
enrollmentRoutes.get("/", verifyToken, authorizeRoles("admin"), getEnrollments);

// Admin views single enrollment
enrollmentRoutes.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  getEnrollment,
);

// Admin updates enrollment status
enrollmentRoutes.patch(
  "/:id/status",
  verifyToken,
  authorizeRoles("admin"),
  updateEnrollmentStatus,
);

// Admin updates payment status
enrollmentRoutes.patch(
  "/:id/payment-status",
  verifyToken,
  authorizeRoles("admin"),
  updateEnrollmentPaymentStatus,
);

// Admin + Instructor can update progress
// Instructor ownership is checked inside the service
enrollmentRoutes.patch(
  "/:id/progress",
  verifyToken,
  authorizeRoles("admin", "instructor"),
  updateEnrollmentProgress,
);

// Only admin can cancel enrollment
enrollmentRoutes.patch(
  "/:id/cancel",
  verifyToken,
  authorizeRoles("admin"),
  cancelEnrollment,
);

export default enrollmentRoutes;
