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

// Public can see approved testimonials
testimonialRoutes.get("/", getApprovedTestimonials);

// Public single testimonial
testimonialRoutes.get("/:id", getTestimonial);


// Student creates testimonial
testimonialRoutes.post("/", verifyToken, authorizeRoles("student"), createTestimonial);

// Student gets own testimonials
testimonialRoutes.get("/my", verifyToken, authorizeRoles("student"), getMyTestimonials);

// Student updates own testimonial
testimonialRoutes.put("/my/:id", verifyToken, authorizeRoles("student"), updateMyTestimonial);

// Student deletes own testimonial
testimonialRoutes.delete("/my/:id", verifyToken, authorizeRoles("student"), deleteMyTestimonial);

// Admin gets all testimonials
testimonialRoutes.get("/admin/all", verifyToken, authorizeRoles("admin"), getAllTestimonials);

// Admin approves
testimonialRoutes.patch("/admin/:id/approve", verifyToken, authorizeRoles("admin"), approveTestimonial);

// Admin rejects
testimonialRoutes.patch("/admin/:id/reject", verifyToken, authorizeRoles("admin"), rejectTestimonial);

// Admin feature/unfeature
testimonialRoutes.patch("/admin/:id/featured", verifyToken, authorizeRoles("admin"), toggleFeaturedTestimonial);

// Admin deletes
testimonialRoutes.delete("/admin/:id", verifyToken, authorizeRoles("admin"), deleteTestimonial);

export default testimonialRoutes;
