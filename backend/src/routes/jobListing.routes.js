import express from "express";

import {
  createJobListing,
  getJobListings,
  getJobListing,
  updateJobListing,
  deleteJobListing,
  publishJobListing,
  closeJobListing,
  incrementJobView,
} from "../controllers/jobListing.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const jobListingRoutes = express.Router();

// Get all jobs
jobListingRoutes.get("/", getJobListings);

// Get single job
jobListingRoutes.get("/:id", getJobListing);

// Increase views
jobListingRoutes.patch("/:id/view", incrementJobView);

//  ADMIN / INSTRUCTOR

// Create job
jobListingRoutes.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "instructor"),
  createJobListing,
);

// Update job
jobListingRoutes.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "instructor"),
  updateJobListing,
);

// Delete job
jobListingRoutes.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "instructor"),
  deleteJobListing,
);

//  ADMIN ONLY

// Publish
jobListingRoutes.patch(
  "/:id/publish",
  verifyToken,
  authorizeRoles("admin"),
  publishJobListing,
);

// Close
jobListingRoutes.patch(
  "/:id/close",
  verifyToken,
  authorizeRoles("admin"),
  closeJobListing,
);

export default jobListingRoutes;
