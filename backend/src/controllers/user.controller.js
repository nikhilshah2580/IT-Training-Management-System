import uploadOnCloudinary from "../utils/cloudinary.js";

import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../utils/cookieOptions.js";

import {
  register,
  login,
  logout,
  refreshAccessToken,
  googleLoginService,
  forgotPassword,
  verifyOtp,
  resetPassword,
  verifyEmail,
  resendVerificationOtp,
} from "../services/auth.service.js";

import {
  getCurrentUserService,
  updateProfileService,
  getUsersService,
  getUserService,
  createUserService,
  updateUserService,
  deleteUserService,
  changePasswordService,
} from "../services/user.service.js";
import { writeAuditLog } from "../utils/auditLog.js";

// SIGN UP
export const signUpUser = async (req, res) => {
  let photo = "";

  if (req.file) {
    const image = await uploadOnCloudinary(req.file.path);

    if (!image?.secure_url) {
      const error = new Error("Image upload failed");
      error.statusCode = 500;
      throw error;
    }

    photo = image.secure_url;
  }

  const result = await register({
    ...req.body,
    photo,
  });

  return res.status(201).json({
    success: true,
    message:
      "Registration successful. Please verify your email before logging in.",
    user: result.user,
  });
};

// VERIFY EMAIL
export const verifyEmailController = async (req, res) => {
  const { email, otp } = req.body;

  const result = await verifyEmail(email, otp);

  return res.status(200).json(result);
};

// RESEND EMAIL OTP
export const resendVerificationOtpController = async (req, res) => {
  const result = await resendVerificationOtp(req.body.email);

  return res.status(200).json(result);
};

// LOGIN
export const loginUser = async (req, res) => {
  const result = await login(req.body);

  res.cookie("accessToken", result.accessToken, accessCookieOptions);

  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: result.user,
  });
};

// GOOGLE LOGIN
export const googleLogin = async (req, res) => {
  const result = await googleLoginService(req.body.credential);

  res.cookie("accessToken", result.accessToken, accessCookieOptions);

  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  return res.status(200).json({
    success: true,
    message: "Google login successful",
    user: result.user,
  });
};

// LOGOUT
export const logoutUser = async (req, res) => {
  await logout(req.user._id);

  res.clearCookie("accessToken", accessCookieOptions);

  res.clearCookie("refreshToken", refreshCookieOptions);

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

// CURRENT USER
export const getCurrentUser = async (req, res) => {
  const user = await getCurrentUserService(req.user._id);

  return res.status(200).json({
    success: true,
    user,
  });
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  let photo;

  if (req.file) {
    const image = await uploadOnCloudinary(req.file.path);

    if (!image?.secure_url) {
      const error = new Error("Image upload failed");
      error.statusCode = 500;
      throw error;
    }

    photo = image.secure_url;
  }

  const user = await updateProfileService(req.user._id, {
    ...req.body,
    ...(photo !== undefined && {
      photo,
    }),
  });

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
};

// ADMIN CREATE USER
export const createUserByAdmin = async (req, res) => {
  const user = await createUserService(req.body);
  await writeAuditLog(req, {
    action: "admin.user.create",
    targetType: "User",
    targetId: user._id,
    metadata: { role: user.role, email: user.email },
  });

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    user,
  });
};

// ADMIN GET USERS
export const getUsers = async (req, res) => {
  const { role, search, page, limit } = req.query;

  const result = await getUsersService({
    role,
    search,
    page,
    limit,
  });

  return res.status(200).json({
    success: true,
    ...result,
  });
};

// ADMIN GET SINGLE USER
export const getUser = async (req, res) => {
  const user = await getUserService(req.params.id);

  return res.status(200).json({
    success: true,
    user,
  });
};

// ADMIN UPDATE USER
export const updateUser = async (req, res) => {
  const user = await updateUserService(req.params.id, req.body);
  await writeAuditLog(req, {
    action: "admin.user.update",
    targetType: "User",
    targetId: req.params.id,
    metadata: { fields: Object.keys(req.body || {}) },
  });

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    user,
  });
};

// ADMIN DELETE USER
export const deleteUser = async (req, res) => {
  await deleteUserService(req.params.id);
  await writeAuditLog(req, {
    action: "admin.user.delete",
    targetType: "User",
    targetId: req.params.id,
  });

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  const result = await refreshAccessToken(token);

  res.cookie("accessToken", result.accessToken, accessCookieOptions);

  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  return res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
  });
};

// FORGOT PASSWORD
export const forgotPasswordController = async (req, res) => {
  const result = await forgotPassword(req.body.email);

  return res.status(200).json(result);
};

// VERIFY RESET OTP
export const verifyOtpController = async (req, res) => {
  const { email, otp } = req.body;

  const result = await verifyOtp(email, otp);

  return res.status(200).json(result);
};

// RESET PASSWORD
export const resetPasswordController = async (req, res) => {
  const { email, otp, password } = req.body;

  const result = await resetPassword(email, otp, password);

  return res.status(200).json(result);
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match",
    });
  }

  await changePasswordService(req.user._id, currentPassword, newPassword);

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};
