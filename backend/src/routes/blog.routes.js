import express from "express";

import {
  createBlog,
  getBlogs,
  getBlog,
  getBlogBySlug,
  incrementBlogViews,
  getAllBlogsAdmin,
  getBlogAdmin,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const blogRoutes = express.Router();

// ADMIN / INSTRUCTOR ROUTES

// Get all blogs including Draft/Archived
blogRoutes.get(
  "/admin/all",
  verifyToken,
  authorizeRoles("admin", "instructor"),
  getAllBlogsAdmin,
);

// Get single blog for management
blogRoutes.get(
  "/admin/:id",
  verifyToken,
  authorizeRoles("admin", "instructor"),
  getBlogAdmin,
);

// PUBLIC ROUTES

// Get published blogs
blogRoutes.get("/", getBlogs);

// Get blog by slug
blogRoutes.get("/slug/:slug", getBlogBySlug);

// Get single published blog
blogRoutes.get("/:id", getBlog);

// Record blog view
blogRoutes.patch("/:id/view", incrementBlogViews);

// Create blog
blogRoutes.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "instructor"),
  upload.single("photo"),
  createBlog,
);

// Update blog
blogRoutes.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "instructor"),
  upload.single("photo"),
  updateBlog,
);

// Delete blog
blogRoutes.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "instructor"),
  deleteBlog,
);

export default blogRoutes;
