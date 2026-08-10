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
} from "../services/auth.service.js";

import {
  getCurrentUserService,
  updateProfileService,
  getUsersService,
  updateUserService,
  deleteUserService,
  changePasswordService,
} from "../services/user.service.js";

/*  REGISTER */
export const signUpUser = async (req, res) => {
  let photo = "";

  if (req.file) {
    const image = await uploadOnCloudinary(req.file.path);
    photo = image.secure_url;
  }

  const result = await register({
    ...req.body,
    photo,
  });

  res.cookie("accessToken", result.accessToken, accessCookieOptions);
  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  res.status(201).json({
    success: true,
    message: "User Registered Successfully",
    user: result.user,
  });
};

/*  LOGIN */
export const loginUser = async (req, res) => {
  const result = await login(req.body);

  res.cookie("accessToken", result.accessToken, accessCookieOptions);
  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  res.status(200).json({
    success: true,
    message: "Login Successful",
    user: result.user,
  });
};

//google LOgin
export const googleLogin = async (req, res) => {
  const result = await googleLoginService(req.body.credential);

  res.cookie("accessToken", result.accessToken, accessCookieOptions);
  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  res.status(200).json({
    success: true,
    message: "Google login successful",
    user: result.user,
  });
};

/*  LOGOUT*/
export const logoutUser = async (req, res) => {
  await logout(req.user._id);

  res.clearCookie("accessToken", accessCookieOptions);
  res.clearCookie("refreshToken", refreshCookieOptions);

  res.status(200).json({
    success: true,
    message: "Logout Successful",
  });
};

/* CURRENT USER*/
export const getCurrentUser = async (req, res) => {
  const user = await getCurrentUserService(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
};

/*  UPDATE PROFILE */
export const updateProfile = async (req, res) => {
  let photo;

  if (req.file) {
    const image = await uploadOnCloudinary(req.file.path);
    photo = image.secure_url;
  }

  const user = await updateProfileService(req.user._id, {
    ...req.body,
    photo,
  });

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user,
  });
};

/* GET USERS*/
export const getUsers = async (req, res) => {
  const users = await getUsersService();

  res.status(200).json({
    success: true,
    users,
  });
};

/*  UPDATE USER */
export const updateUser = async (req, res) => {
  const user = await updateUserService(req.params.id, req.body);

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({
    success: true,
    message: "User Updated Successfully",
    user,
  });
};

/*  DELETE USER*/
export const deleteUser = async (req, res) => {
  const user = await deleteUserService(req.params.id);

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
};

//refresh token
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  const result = await refreshAccessToken(token);

  res.cookie("accessToken", result.accessToken, accessCookieOptions);
  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
  });
};

export const forgotPasswordController = async (req, res) => {
  try {
    console.log(req.body);

    const result = await forgotPassword(req.body.email);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//verify otp
export const verifyOtpController = async (req, res) => {
  const { email, otp } = req.body;

  const result = await verifyOtp(email, otp);
  res.status(200).json(result);
};

//reset password
export const resetPasswordController = async (req, res) => {
  const { email, otp, password } = req.body;

  const result = await resetPassword(email, otp, password);

  res.status(200).json(result);
};

//change password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match.",
    });
  }

  await changePasswordService(req.user._id, currentPassword, newPassword);

  res.status(200).json({
    success: true,
    message: "Password changed successfully.",
  });
};
