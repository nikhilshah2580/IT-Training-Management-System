import express from "express";

import {
  createJobPlacement,
  getJobPlacements,
  getJobPlacement,
  getMyPlacements,
  updateJobPlacement,
  updateJobPlacementStatus,
  deleteJobPlacement,
} from "../controllers/jobPlacement.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const jobPlacementRoutes = express.Router();

// PUBLIC ROUTES

jobPlacementRoutes.get("/", getJobPlacements);

// STUDENT ROUTES

jobPlacementRoutes.get(
  "/my",
  verifyToken,
  authorizeRoles("student"),
  getMyPlacements,
);

//ADMIN ROUTES

jobPlacementRoutes.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  createJobPlacement,
);

jobPlacementRoutes.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "instructor"),
  getJobPlacement,
);

jobPlacementRoutes.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  updateJobPlacement,
);

jobPlacementRoutes.patch(
  "/:id/status",
  verifyToken,
  authorizeRoles("admin"),
  updateJobPlacementStatus,
);

jobPlacementRoutes.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteJobPlacement,
);

export default jobPlacementRoutes;
