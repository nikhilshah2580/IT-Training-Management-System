import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import sendEmail from "../utils/sendEmail.js";
import { notifyAdmins } from "../utils/notificationEvents.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper
const getSafeUser = async (id) => {
  return await User.findById(id).select(
    "-password -refreshToken -resetOtp -resetOtpExpire -verificationOtp -verificationOtpExpire",
  );
};

// REGISTER
export const register = async (data) => {
  const {
    fullName,
    email,
    password,
    phone = "",
    address = "",
    photo = "",
  } = data;

  const normalizedEmail = email?.toLowerCase().trim();

  if (!fullName?.trim() || !normalizedEmail || !password) {
    const error = new Error("Full name, email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const verificationOtp = crypto.randomInt(100000, 1000000).toString();

  const verificationOtpExpire = new Date(Date.now() + 10 * 60 * 1000);

  const user = await User.create({
    fullName,
    email: normalizedEmail,
    password: hashedPassword,
    phone,
    address,
    photo,
    role: "student",
    authProvider: "local",
    isVerified: false,
    verificationOtp,
    verificationOtpExpire,
  });

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
      <h2>Sipalaya Info Tech Pvt. Ltd.</h2>

      <p>Hello <strong>${user.fullName}</strong>,</p>

      <p>
        Thank you for registering with Sipalaya Info Tech Pvt. Ltd.
      </p>

      <p>Your email verification OTP is:</p>

      <h1 style="letter-spacing:8px;">
        ${verificationOtp}
      </h1>

      <p>This OTP will expire in 10 minutes.</p>

      <p>
        Sipalaya Info Tech Pvt. Ltd.<br>
        Narephat 32, Koteshwor, Kathmandu<br>
        Ph: 9851344071 | 9806393939<br>
        Email: infotech@sipalaya.com
      </p>
    </div>
  `;

  await sendEmail(user.email, "Verify Your Email - Sipalaya Info Tech", html);

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: await getSafeUser(user._id),
  };
};

// VERIFY EMAIL
export const verifyEmail = async (email, otp) => {
  const normalizedEmail = email?.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+verificationOtp +verificationOtpExpire");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.isVerified) {
    const error = new Error("Email is already verified");
    error.statusCode = 400;
    throw error;
  }

  if (!user.verificationOtp) {
    const error = new Error("Verification OTP not found");
    error.statusCode = 400;
    throw error;
  }

  if (user.verificationOtp !== otp) {
    const error = new Error("Invalid verification OTP");
    error.statusCode = 400;
    throw error;
  }

  if (!user.verificationOtpExpire || user.verificationOtpExpire < new Date()) {
    const error = new Error("Verification OTP expired");
    error.statusCode = 400;
    throw error;
  }

  user.isVerified = true;
  user.verificationOtp = "";
  user.verificationOtpExpire = null;

  await user.save();

  return {
    success: true,
    message: "Email verified successfully",
  };
};

// RESEND VERIFICATION OTP
export const resendVerificationOtp = async (email) => {
  const normalizedEmail = email?.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+verificationOtp +verificationOtpExpire");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.isVerified) {
    const error = new Error("Email is already verified");
    error.statusCode = 400;
    throw error;
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  user.verificationOtp = otp;
  user.verificationOtpExpire = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  const html = `
    <div style="font-family:Arial,sans-serif;">
      <h2>Sipalaya Info Tech Pvt. Ltd.</h2>
      <p>Hello ${user.fullName},</p>
      <p>Your new email verification OTP is:</p>
      <h1 style="letter-spacing:8px;">${otp}</h1>
      <p>This OTP expires in 10 minutes.</p>
    </div>
  `;

  await sendEmail(user.email, "Email Verification OTP", html);

  return {
    success: true,
    message: "Verification OTP sent successfully",
  };
};

// LOGIN
export const login = async ({ email, password }) => {
  const normalizedEmail = email?.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password +refreshToken");

  if (!user) {
    const error = new Error("User not registered");
    error.statusCode = 400;
    throw error;
  }

  if ((user.authProvider || "local") === "google") {
    const error = new Error("This account uses Google login");
    error.statusCode = 400;
    throw error;
  }

  if (!user.isVerified) {
    const error = new Error("Please verify your email before logging in");
    error.statusCode = 403;
    throw error;
  }

  if (!user.password) {
    const error = new Error(
      "Password authentication is not available for this account",
    );
    error.statusCode = 400;
    throw error;
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    const error = new Error("Invalid credentials");
    error.statusCode = 400;
    throw error;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: await getSafeUser(user._id),
  };
};

// GOOGLE LOGIN
export const googleLoginService = async (credential) => {
  if (!credential) {
    const error = new Error("Google credential is required");
    error.statusCode = 400;
    throw error;
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    const error = new Error("Google account email not available");
    error.statusCode = 400;
    throw error;
  }

  const email = payload.email.toLowerCase().trim();

  let user = await User.findOne({
    email,
  });

  if (!user) {
    user = await User.create({
      fullName: payload.name || "Google User",
      email,
      photo: payload.picture || "",
      googleId: payload.sub,
      role: "student",
      authProvider: "google",
      isVerified: true,
    });
  } else {
    if (user.authProvider === "local" && !user.googleId) {
      user.googleId = payload.sub;
    }

    user.isVerified = true;

    await user.save();
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;

  await user.save();

  return {
    accessToken,
    refreshToken,
    user: await getSafeUser(user._id),
  };
};

// LOGOUT
export const logout = async (id) => {
  const user = await User.findById(id).select("+refreshToken");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.refreshToken = "";

  await user.save();

  return true;
};

// REFRESH TOKEN
export const refreshAccessToken = async (token) => {
  if (!token) {
    const error = new Error("Refresh token missing");
    error.statusCode = 401;
    throw error;
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
  } catch {
    const error = new Error("Invalid refresh token");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.refreshToken !== token) {
    const error = new Error("Refresh token mismatch");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;

  await user.save();

  return {
    accessToken,
    refreshToken,
  };
};

// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  const normalizedEmail = email?.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+resetOtp +resetOtpExpire");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  user.resetOtp = otp;

  user.resetOtpExpire = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
      <h2>Sipalaya Info Tech Pvt. Ltd.</h2>

      <p>Hello <strong>${user.fullName}</strong>,</p>

      <p>
        We received a request to reset your password.
      </p>

      <p>Your password reset OTP is:</p>

      <h1 style="letter-spacing:8px;">${otp}</h1>

      <p>
        This OTP is valid for 10 minutes.
      </p>

      <p>
        If you did not request this password reset,
        please ignore this email.
      </p>
    </div>
  `;

  await sendEmail(user.email, "Password Reset OTP - Sipalaya Info Tech", html);

  return {
    success: true,
    message: "OTP sent successfully",
  };
};

// VERIFY RESET OTP
export const verifyOtp = async (email, otp) => {
  const normalizedEmail = email?.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+resetOtp +resetOtpExpire");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (!user.resetOtp) {
    const error = new Error("OTP not found");
    error.statusCode = 400;
    throw error;
  }

  if (user.resetOtp !== otp) {
    const error = new Error("Invalid OTP");
    error.statusCode = 400;
    throw error;
  }

  if (!user.resetOtpExpire || user.resetOtpExpire < new Date()) {
    const error = new Error("OTP expired");
    error.statusCode = 400;
    throw error;
  }

  return {
    success: true,
    message: "OTP verified successfully",
  };
};

// RESET PASSWORD
export const resetPassword = async (email, otp, password) => {
  const normalizedEmail = email?.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password +resetOtp +resetOtpExpire +refreshToken");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.resetOtp !== otp) {
    const error = new Error("Invalid OTP");
    error.statusCode = 400;
    throw error;
  }

  if (!user.resetOtpExpire || user.resetOtpExpire < new Date()) {
    const error = new Error("OTP expired");
    error.statusCode = 400;
    throw error;
  }

  user.password = await bcrypt.hash(password, 12);

  user.resetOtp = "";
  user.resetOtpExpire = null;

  // invalidate existing login sessions
  user.refreshToken = "";

  await user.save();

  return {
    success: true,
    message: "Password reset successfully",
  };
};
