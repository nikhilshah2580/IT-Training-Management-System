import express from "express";

import {
  createResource,
  getResources,
  getResource,
  getCourseResources,
  updateResource,
  adminUpdateResource,
  deleteResource,
  adminDeleteResource,
} from "../controllers/resource.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const resourceRoutes = express.Router();

//  PUBLIC / STUDENT

// Get all resources for admin or own resources for instructor
resourceRoutes.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "instructor"),
  getResources,
);

// Get published resources for a course
resourceRoutes.get(
  "/course/:courseId",
  verifyToken,
  authorizeRoles("student", "instructor", "admin"),
  getCourseResources,
);

// Get single resource
resourceRoutes.get(
  "/:id",
  verifyToken,
  authorizeRoles("student", "instructor", "admin"),
  getResource,
);

//  INSTRUCTOR

// Create resource
resourceRoutes.post(
  "/",
  verifyToken,
  authorizeRoles("instructor"),
  createResource,
);

// Update own resource
resourceRoutes.put(
  "/:id",
  verifyToken,
  authorizeRoles("instructor"),
  updateResource,
);

// Delete own resource
resourceRoutes.delete(
  "/:id",
  verifyToken,
  authorizeRoles("instructor"),
  deleteResource,
);

//  ADMIN

// Admin update
resourceRoutes.put(
  "/admin/:id",
  verifyToken,
  authorizeRoles("admin"),
  adminUpdateResource,
);

// Admin delete
resourceRoutes.delete(
  "/admin/:id",
  verifyToken,
  authorizeRoles("admin"),
  adminDeleteResource,
);

export default resourceRoutes;
