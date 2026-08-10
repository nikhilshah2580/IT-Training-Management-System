import express from "express";

import {
  createContact,
  getContacts,
  getContact,
  updateContactStatus,
  deleteContact,
  replyContact,
} from "../controllers/contact.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Public
router.post("/", createContact);

// Admin
router.get("/", verifyToken, verifyAdmin, getContacts);
router.get("/:id", verifyToken, verifyAdmin, getContact);
router.put("/:id", verifyToken, verifyAdmin, updateContactStatus);
router.delete("/:id", verifyToken, verifyAdmin, deleteContact);
router.put("/:id/reply", verifyToken, verifyAdmin, replyContact);

export default router;
