import express from "express";

import {
  getMyNotifications,
  getNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  createAdminNotification,
} from "../controllers/notification.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const notificationRoutes = express.Router();

//USER NOTIFICATIONS

// Get my notifications
notificationRoutes.get("/", verifyToken, getMyNotifications);

// Get single notification
notificationRoutes.get("/:id", verifyToken, getNotification);

// Mark one as read
notificationRoutes.patch("/:id/read", verifyToken, markNotificationAsRead);

// Mark all as read
notificationRoutes.patch("/read-all", verifyToken, markAllNotificationsAsRead);

// Delete one
notificationRoutes.delete("/:id", verifyToken, deleteNotification);

// Delete all
notificationRoutes.delete("/", verifyToken, deleteAllNotifications);

//ADMIN
notificationRoutes.post(
  "/admin/create",
  verifyToken,
  authorizeRoles("admin"),
  createAdminNotification,
);

export default notificationRoutes;
