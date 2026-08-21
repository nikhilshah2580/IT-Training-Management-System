import express from "express";

import {
  createTestimonial,
  getApprovedTestimonials,
  getMyTestimonials,
  getTestimonial,
  updateMyTestimonial,
  getAllTestimonials,
  approveTestimonial,
  rejectTestimonial,
  toggleFeaturedTestimonial,
  deleteMyTestimonial,
  deleteTestimonial,
} from "../controllers/testimonial.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const testimonialRoutes = express.Router();

testimonialRoutes.get(
  "/my",
  verifyToken,
  authorizeRoles("student"),
  getMyTestimonials,
);
testimonialRoutes.put(
  "/my/:id",
  verifyToken,
  authorizeRoles("student"),
  updateMyTestimonial,
);
testimonialRoutes.delete(
  "/my/:id",
  verifyToken,
  authorizeRoles("student"),
  deleteMyTestimonial,
);

testimonialRoutes.get(
  "/admin/all",
  verifyToken,
  authorizeRoles("admin"),
  getAllTestimonials,
);
testimonialRoutes.patch(
  "/admin/:id/approve",
  verifyToken,
  authorizeRoles("admin"),
  approveTestimonial,
);
testimonialRoutes.patch(
  "/admin/:id/reject",
  verifyToken,
  authorizeRoles("admin"),
  rejectTestimonial,
);
testimonialRoutes.patch(
  "/admin/:id/featured",
  verifyToken,
  authorizeRoles("admin"),
  toggleFeaturedTestimonial,
);
testimonialRoutes.delete(
  "/admin/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteTestimonial,
);

testimonialRoutes.get("/", getApprovedTestimonials);
testimonialRoutes.get("/:id", getTestimonial);
testimonialRoutes.post(
  "/",
  verifyToken,
  authorizeRoles("student"),
  createTestimonial,
);

export default testimonialRoutes;
