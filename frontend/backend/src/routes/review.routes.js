import express from "express";

import {
    createReview,
    getCourseReviews,
    getCourseRating,
    getAllReviews,
    getReview,
    updateReview,
    updateReviewStatus,
    deleteOwnReview,
    adminDeleteReview,
} from "../controllers/review.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const reviewRoutes = express.Router();

//PUBLIC ROUTES

// Approved reviews for a course
reviewRoutes.get("/course/:courseId", getCourseReviews);

// Course rating summary
reviewRoutes.get("/course/:courseId/rating", getCourseRating);

//STUDENT ROUTES

// Create review
reviewRoutes.post("/", verifyToken, authorizeRoles("student"), createReview);

// Update own review
reviewRoutes.put("/:id", verifyToken, authorizeRoles("student"), updateReview);

// Delete own review
reviewRoutes.delete("/:id", verifyToken, authorizeRoles("student"), deleteOwnReview);

//ADMIN ROUTES

// Get all reviews
reviewRoutes.get("/admin/all", verifyToken, authorizeRoles("admin"), getAllReviews);

// Get single review
reviewRoutes.get("/admin/:id", verifyToken, authorizeRoles("admin"), getReview);

// Approve / Reject
reviewRoutes.patch("/admin/:id/status", verifyToken, authorizeRoles("admin"), updateReviewStatus);

// Delete any review
reviewRoutes.delete("/admin/:id", verifyToken, authorizeRoles("admin"), adminDeleteReview);

export default reviewRoutes;
