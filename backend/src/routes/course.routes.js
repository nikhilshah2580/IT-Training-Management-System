import express from "express";

import {
    createCourse,
    getCourses,
    getCourse,
    updateCourse,
    deleteCourse,
    approveCourse,
    rejectCourse,
    updateCourseStatus,
} from "../controllers/course.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const courseRoutes = express.Router();

// Get courses
courseRoutes.get("/", getCourses);
// Get single course
courseRoutes.get("/:id", getCourse);
// Instructor creates course
courseRoutes.post("/", verifyToken, authorizeRoles("instructor"), createCourse);
// Instructor/Admin updates course
courseRoutes.put("/:id", verifyToken, authorizeRoles("admin", "instructor"), updateCourse);
// Instructor/Admin deletes course
courseRoutes.delete("/:id", verifyToken, authorizeRoles("admin", "instructor"), deleteCourse);
// Approve course
courseRoutes.patch("/:id/approve", verifyToken, authorizeRoles("admin"), approveCourse);
// Reject course
courseRoutes.patch("/:id/reject", verifyToken, authorizeRoles("admin"), rejectCourse);
// Change status
courseRoutes.patch("/:id/status", verifyToken, authorizeRoles("admin"), updateCourseStatus);

export default courseRoutes;