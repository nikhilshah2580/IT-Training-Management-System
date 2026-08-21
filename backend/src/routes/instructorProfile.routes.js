import express from "express";

import {
  createInstructorProfile,
  getMyInstructorProfile,
  getInstructorProfile,
  getApprovedInstructors,
  getAllInstructorProfiles,
  updateInstructorProfile,
  approveInstructorProfile,
  rejectInstructorProfile,
  deleteInstructorProfile,
} from "../controllers/instructorProfile.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const instructorProfileRoutes = express.Router();

// PUBLIC ROUTES

// All approved instructors
instructorProfileRoutes.get("/approved", getApprovedInstructors);

// INSTRUCTOR ROUTES

// Create profile
instructorProfileRoutes.post(
  "/",
  verifyToken,
  authorizeRoles("instructor"),
  upload.single("photo"),
  createInstructorProfile,
);

// My profile
instructorProfileRoutes.get(
  "/me/profile",
  verifyToken,
  authorizeRoles("instructor"),
  getMyInstructorProfile,
);

// Update my profile
instructorProfileRoutes.put(
  "/me/profile",
  verifyToken,
  authorizeRoles("instructor"),
  upload.single("photo"),
  updateInstructorProfile,
);

// ADMIN ROUTES

// Get all profiles
instructorProfileRoutes.get(
  "/admin/all",
  verifyToken,
  authorizeRoles("admin"),
  getAllInstructorProfiles,
);

// Approve
instructorProfileRoutes.patch(
  "/admin/:id/approve",
  verifyToken,
  authorizeRoles("admin"),
  approveInstructorProfile,
);

// Reject
instructorProfileRoutes.patch(
  "/admin/:id/reject",
  verifyToken,
  authorizeRoles("admin"),
  rejectInstructorProfile,
);

// Delete
instructorProfileRoutes.delete(
  "/admin/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteInstructorProfile,
);

// Single approved instructor
instructorProfileRoutes.get("/:id", getInstructorProfile);

export default instructorProfileRoutes;
