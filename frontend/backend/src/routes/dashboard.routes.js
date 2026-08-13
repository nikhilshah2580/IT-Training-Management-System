import express from "express";

import { getDashboard } from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const dashboardRoutes = express.Router();

//ADMIN DASHBOARD
dashboardRoutes.get("/", verifyToken, authorizeRoles("admin"), getDashboard);

export default dashboardRoutes;
