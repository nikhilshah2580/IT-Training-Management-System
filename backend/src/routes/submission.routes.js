import { Router } from "express";
import {
  submitAssignment,
  getMySubmissions,
  getSubmissionsByAssignment,
  getSubmission,
  getSubmissionFile,
  gradeSubmission,
} from "../controllers/submission.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const submissionRoutes = Router();

// Student - Submit assignment
submissionRoutes.post(
  "/:assignmentId",
  verifyToken,
  authorizeRoles("student"),
  upload.single("file"),
  submitAssignment,
);

// Student - Get my submissions
submissionRoutes.get(
  "/my",
  verifyToken,
  authorizeRoles("student"),
  getMySubmissions,
);

// Instructor/Admin - Get submissions for an assignment
submissionRoutes.get(
  "/assignment/:assignmentId",
  verifyToken,
  authorizeRoles("instructor", "admin"),
  getSubmissionsByAssignment,
);

// Open/Download submitted file
submissionRoutes.get(
  "/:id/file",
  verifyToken,
  authorizeRoles("student", "instructor", "admin"),
  getSubmissionFile,
);

// Get single submission
submissionRoutes.get(
  "/:id",
  verifyToken,
  authorizeRoles("student", "instructor", "admin"),
  getSubmission,
);

// Instructor - Grade submission
submissionRoutes.patch(
  "/:id/grade",
  verifyToken,
  authorizeRoles("instructor", "admin"),
  gradeSubmission,
);

export default submissionRoutes;
