import express from "express";

import {
  createAttendance,
  getAttendances,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  getMyAttendance,
  getMyAttendancePercentage,
} from "../controllers/attendance.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createAttendanceValidation,
  updateAttendanceValidation,
} from "../validations/attendance.validation.js";

const attendanceRoutes = express.Router();

// Student views own attendance
attendanceRoutes.get(
  "/my",
  verifyToken,
  authorizeRoles("student"),
  getMyAttendance,
);

// Student attendance percentage
attendanceRoutes.get(
  "/my/percentage",
  verifyToken,
  authorizeRoles("student"),
  getMyAttendancePercentage,
);

// Instructor marks attendance
attendanceRoutes.post(
  "/",
  verifyToken,
  authorizeRoles("instructor", "admin"),
  validate(createAttendanceValidation),
  createAttendance,
);

// Instructor/Admin view attendance
attendanceRoutes.get(
  "/",
  verifyToken,
  authorizeRoles("instructor", "admin"),
  getAttendances,
);

// Instructor/Admin view single attendance
attendanceRoutes.get(
  "/:id",
  verifyToken,
  authorizeRoles("instructor", "admin"),
  getAttendance,
);

// Instructor/Admin update
attendanceRoutes.put(
  "/:id",
  verifyToken,
  authorizeRoles("instructor", "admin"),
  validate(updateAttendanceValidation),
  updateAttendance,
);

// Admin delete
attendanceRoutes.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteAttendance,
);

export default attendanceRoutes;
