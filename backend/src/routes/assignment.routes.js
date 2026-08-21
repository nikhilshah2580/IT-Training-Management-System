import express from "express";

import {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  getInstructorAssignments,
} from "../controllers/assignment.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const assignmentRoutes = express.Router();

// Public/student/instructor can view assignments
assignmentRoutes.get(
  "/",
  verifyToken,
  authorizeRoles("student", "instructor", "admin"),
  getAssignments,
);
// Instructor's assignments
assignmentRoutes.get(
  "/my-assignments",
  verifyToken,
  authorizeRoles("instructor"),
  getInstructorAssignments,
);
// Single assignment
assignmentRoutes.get(
  "/:id",
  verifyToken,
  authorizeRoles("student", "instructor", "admin"),
  getAssignment,
);
// Instructor creates assignment
assignmentRoutes.post(
  "/",
  verifyToken,
  authorizeRoles("instructor"),
  createAssignment,
);
// Instructor updates own assignment
assignmentRoutes.put(
  "/:id",
  verifyToken,
  authorizeRoles("instructor"),
  updateAssignment,
);
// Instructor deletes own assignment
assignmentRoutes.delete(
  "/:id",
  verifyToken,
  authorizeRoles("instructor"),
  deleteAssignment,
);

export default assignmentRoutes;
