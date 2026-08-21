import express from "express";

import {
  createSubmission,
  getMySubmissions,
  getSubmission,
  getSubmissionsByAssignment,
  gradeSubmission,
  deleteSubmission,
  getAllSubmissions,
} from "../controllers/submission.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const submissionRoutes = express.Router();

// Submit assignment
submissionRoutes.post(
  "/",
  verifyToken,
  authorizeRoles("student"),
  upload.single("file"),
  createSubmission,
);
// Get logged-in student's submissions
submissionRoutes.get(
  "/my",
  verifyToken,
  authorizeRoles("student"),
  getMySubmissions,
);
// View submissions for an assignment
submissionRoutes.get(
  "/assignment/:assignmentId",
  verifyToken,
  authorizeRoles("instructor", "admin"),
  getSubmissionsByAssignment,
);
// Grade submission
submissionRoutes.patch(
  "/:id/grade",
  verifyToken,
  authorizeRoles("instructor", "admin"),
  gradeSubmission,
);
// Get all submissions
submissionRoutes.get(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  getAllSubmissions,
);
// Get single submission
submissionRoutes.get(
  "/:id",
  verifyToken,
  authorizeRoles("student", "instructor", "admin"),
  getSubmission,
);
// Delete own submission
submissionRoutes.delete(
  "/:id",
  verifyToken,
  authorizeRoles("student"),
  deleteSubmission,
);

export default submissionRoutes;
