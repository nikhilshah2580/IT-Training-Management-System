import express from "express";
import {
  createJobApplication,
  getJobApplications,
  downloadJobApplicationResume,
  updateJobApplicationStatus,
  deleteJobApplication,
} from "../controllers/jobApplication.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const routes = express.Router();
routes.post("/", upload.single("resume"), createJobApplication);
routes.get("/", verifyToken, authorizeRoles("admin"), getJobApplications);
routes.get(
  "/:id/resume",
  verifyToken,
  authorizeRoles("admin"),
  downloadJobApplicationResume,
);
routes.patch(
  "/:id/status",
  verifyToken,
  authorizeRoles("admin"),
  updateJobApplicationStatus,
);
routes.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteJobApplication,
);
export default routes;
