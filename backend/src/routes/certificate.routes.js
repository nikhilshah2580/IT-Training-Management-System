import express from "express";

import {
  createCertificate,
  getCertificates,
  getCertificate,
  getMyCertificates,
  verifyCertificate,
  updateCertificate,
  revokeCertificate,
  deleteCertificate,
} from "../controllers/certificate.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const certificateRoutes = express.Router();

// PUBLIC

// Anyone can verify a certificate
certificateRoutes.get("/verify/:verificationCode", verifyCertificate);

// STUDENT

// Student sees own certificates
certificateRoutes.get(
  "/my",
  verifyToken,
  authorizeRoles("student"),
  getMyCertificates,
);

// ADMIN / INSTRUCTOR

// Issue certificate
certificateRoutes.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "instructor"),
  createCertificate,
);

// Get all certificates
certificateRoutes.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "instructor"),
  getCertificates,
);

// Get single certificate
certificateRoutes.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "instructor", "student"),
  getCertificate,
);

// Update certificate
certificateRoutes.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "instructor"),
  updateCertificate,
);

// Revoke certificate
certificateRoutes.patch(
  "/:id/revoke",
  verifyToken,
  authorizeRoles("admin"),
  revokeCertificate,
);

// Delete certificate
certificateRoutes.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteCertificate,
);

export default certificateRoutes;
