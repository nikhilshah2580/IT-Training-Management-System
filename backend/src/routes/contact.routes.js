import express from "express";

import { createContact, getContacts, getContact, getMyContacts, updateContact, deleteContact } from "../controllers/contact.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const contactRoutes = express.Router();

// PUBLIC
// Anyone can submit a contact inquiry
contactRoutes.post("/", createContact);

// USER
// Logged-in user can see their inquiries
contactRoutes.get("/my", verifyToken, getMyContacts);

// ADMIN
// Get all inquiries
contactRoutes.get("/", verifyToken, authorizeRoles("admin"), getContacts);

// ADMIN
// Get single inquiry
contactRoutes.get("/:id", verifyToken, authorizeRoles("admin"), getContact);

// ADMIN
// Update inquiry / reply
contactRoutes.put("/:id", verifyToken, authorizeRoles("admin"), updateContact);

// ADMIN
// Delete inquiry
contactRoutes.delete("/:id", verifyToken, authorizeRoles("admin"), deleteContact);

export default contactRoutes;
