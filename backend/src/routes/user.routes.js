import express from "express";
import {
  deleteUser,
  getCurrentUser,
  getUsers,
  loginUser,
  logoutUser,
  signUpUser,
  updateUser,
  refreshToken,
  updateProfile,
  changePassword,
  googleLogin,
  forgotPasswordController,
  verifyOtpController,
  resetPasswordController,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const userRoutes = express.Router();

// Public Routes
userRoutes.post("/signup", upload.single("photo"), signUpUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/logout", verifyToken, logoutUser);
userRoutes.post("/google-login", googleLogin);
userRoutes.post("/forgot-password", forgotPasswordController);
userRoutes.post("/verify-otp", verifyOtpController);
userRoutes.post("/reset-password", resetPasswordController);

// Logged-in User Routes
userRoutes.put("/change-password", verifyToken, changePassword);
userRoutes.get("/me", verifyToken, getCurrentUser);
userRoutes.post("/refresh-token", refreshToken);
userRoutes.put("/profile", verifyToken, upload.single("photo"), updateProfile);

// Admin Only Routes
userRoutes.get("/", verifyToken, verifyAdmin, getUsers);
userRoutes
  .route("/:id")
  .put(verifyToken, verifyAdmin, updateUser)
  .delete(verifyToken, verifyAdmin, deleteUser);

export default userRoutes;
