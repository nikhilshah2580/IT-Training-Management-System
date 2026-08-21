import express from "express";

import { getAuditLogs } from "../controllers/auditLog.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const auditLogRoutes = express.Router();

auditLogRoutes.get("/", verifyToken, verifyAdmin, getAuditLogs);

export default auditLogRoutes;
