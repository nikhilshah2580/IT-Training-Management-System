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
  createUserByAdmin,
  verifyEmailController,
  resendVerificationOtpController,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  authLimiter,
  otpLimiter,
} from "../middlewares/rateLimit.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createUserValidation,
  updateUserValidation,
} from "../validations/user.validation.js";

const userRoutes = express.Router();

// PUBLIC ROUTES

userRoutes.post("/signup", upload.single("photo"), signUpUser);
userRoutes.post("/login", authLimiter, loginUser);
userRoutes.post("/google-login", authLimiter, googleLogin);
userRoutes.post("/forgot-password", otpLimiter, forgotPasswordController);
userRoutes.post("/verify-otp", otpLimiter, verifyOtpController);
userRoutes.post("/reset-password", otpLimiter, resetPasswordController);
userRoutes.post("/verify-email", otpLimiter, verifyEmailController);
userRoutes.post(
  "/resend-verification-otp",
  otpLimiter,
  resendVerificationOtpController,
);

// AUTHENTICATED USER ROUTES

userRoutes.post("/logout", verifyToken, logoutUser);
userRoutes.post("/refresh-token", refreshToken);
userRoutes.get("/me", verifyToken, getCurrentUser);
userRoutes.put("/profile", verifyToken, upload.single("photo"), updateProfile);
userRoutes.put("/change-password", verifyToken, changePassword);

// ADMIN ROUTES
userRoutes.post(
  "/admin/create",
  verifyToken,
  verifyAdmin,
  validate(createUserValidation),
  createUserByAdmin,
);
userRoutes.get("/", verifyToken, verifyAdmin, getUsers);
userRoutes
  .route("/:id")
  .put(verifyToken, verifyAdmin, validate(updateUserValidation), updateUser)
  .delete(verifyToken, verifyAdmin, deleteUser);

export default userRoutes;
