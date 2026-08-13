import express from "express";

import {
    createDemoClass,
    getDemoClasses,
    getDemoClass,
    updateDemoClass,
    adminUpdateDemoClass,
    deleteDemoClass,
    adminDeleteDemoClass,
    bookDemoClass,
    cancelDemoBooking,
    getMyDemoBookings,
} from "../controllers/demoClass.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const demoClassRoutes = express.Router();

//   AUTHENTICATED VIEW

demoClassRoutes.get("/", verifyToken, authorizeRoles("student", "instructor", "admin"), getDemoClasses);

demoClassRoutes.get("/:id", verifyToken, authorizeRoles("student", "instructor", "admin"), getDemoClass);

//   STUDENT

// My bookings
demoClassRoutes.get("/student/my-bookings", verifyToken, authorizeRoles("student"), getMyDemoBookings);

// Book
demoClassRoutes.post("/:id/book", verifyToken, authorizeRoles("student"), bookDemoClass);

// Cancel booking
demoClassRoutes.patch("/:id/cancel-booking", verifyToken, authorizeRoles("student"), cancelDemoBooking);

//   INSTRUCTOR

// Create
demoClassRoutes.post("/", verifyToken, authorizeRoles("instructor"), createDemoClass);

// Update own demo class
demoClassRoutes.put("/:id", verifyToken, authorizeRoles("instructor"), updateDemoClass);

// Delete own demo class
demoClassRoutes.delete("/:id", verifyToken, authorizeRoles("instructor"), deleteDemoClass);

//   ADMIN

// Admin update
demoClassRoutes.put("/admin/:id", verifyToken, authorizeRoles("admin"), adminUpdateDemoClass);

// Admin delete
demoClassRoutes.delete("/admin/:id", verifyToken, authorizeRoles("admin"), adminDeleteDemoClass);

export default demoClassRoutes;
