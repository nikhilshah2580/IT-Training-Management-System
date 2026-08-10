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
} from "../controllers/user.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const userRoutes = express.Router();


// PUBLIC ROUTES

userRoutes.post("/signup", upload.single("photo"), signUpUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/google-login", googleLogin);
userRoutes.post("/forgot-password", forgotPasswordController);
userRoutes.post("/verify-otp", verifyOtpController);
userRoutes.post("/reset-password", resetPasswordController);



// AUTHENTICATED USER ROUTES

userRoutes.post("/logout", verifyToken, logoutUser);
userRoutes.post("/refresh-token", refreshToken);
userRoutes.get("/me", verifyToken, getCurrentUser);
userRoutes.put("/profile",verifyToken,upload.single("photo"),updateProfile);
userRoutes.put("/change-password",verifyToken,changePassword);

// ADMIN ROUTES
userRoutes.post("/admin/create",verifyToken,verifyAdmin,createUserByAdmin);
userRoutes.get("/",verifyToken,verifyAdmin,getUsers);
userRoutes.route("/:id").put(verifyToken,verifyAdmin,updateUser).delete(verifyToken,verifyAdmin,deleteUser);

export default userRoutes;