import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { OAuth2Client } from "google-auth-library";
import sendEmail from "../utils/sendEmail.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//signup
export const register = async (data) => {
  const { fullName, email, password, phone, address, photo } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const err = new Error("User already exists");
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    phone,
    address,
    photo,
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: await User.findById(user._id).select("-password -refreshToken"),
  };
};

//login
export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    const err = new Error("User not registered");
    err.statusCode = 400;
    throw err;
  }

  // Google account
  if (!user.password) {
    const err = new Error("Please login using Google.");
    err.statusCode = 400;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    const err = new Error("Invalid credentials");
    err.statusCode = 400;
    throw err;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: await User.findById(user._id).select("-password -refreshToken"),
  };
};

//goggle login
export const googleLoginService = async (credential) => {
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  let user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    user = await User.create({
      fullName: payload.name,
      email: payload.email,
      photo: payload.picture,
      googleId: payload.sub,
    });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: await User.findById(user._id).select("-password -refreshToken"),
  };
};

//logout
export const logout = async (id) => {
  const user = await User.findById(id);

  if (!user) return;

  user.refreshToken = "";
  await user.save();
};

export const refreshAccessToken = async (token) => {
  if (!token) {
    const err = new Error("Refresh token missing");
    err.statusCode = 401;
    throw err;
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
  } catch {
    const err = new Error("Invalid refresh token");
    err.statusCode = 401;
    throw err;
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  if (user.refreshToken !== token) {
    const err = new Error("Refresh token mismatch");
    err.statusCode = 401;
    throw err;
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

//verify otp
export const verifyOtp = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  if (!user.resetOtp) {
    const err = new Error("OTP not found");
    err.statusCode = 400;
    throw err;
  }

  if (user.resetOtp !== otp) {
    const err = new Error("Invalid OTP");
    err.statusCode = 400;
    throw err;
  }

  if (user.resetOtpExpire < new Date()) {
    const err = new Error("OTP expired");
    err.statusCode = 400;
    throw err;
  }

  return {
    success: true,
    message: "OTP verified successfully",
  };
};

// resetpassword
export const resetPassword = async (email, otp, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  if (user.resetOtp !== otp) {
    const err = new Error("Invalid OTP");
    err.statusCode = 400;
    throw err;
  }

  if (user.resetOtpExpire < new Date()) {
    const err = new Error("OTP expired");
    err.statusCode = 400;
    throw err;
  }

  user.password = await bcrypt.hash(password, 10);

  user.resetOtp = "";
  user.resetOtpExpire = null;
  await user.save();

  return {
    success: true,
    message: "Password reset successfully",
  };
};


//forget password
export const forgotPassword = async (email) => {
  // Normalize email to prevent case-sensitive mismatches
  const normalizedEmail = email ? email.toLowerCase().trim() : "";

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  // Generate a secure 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save hashed OTP in production for better security (optional but recommended), 
  // or store plain text if standard for your current flow.
  user.resetOtp = otp;
  user.resetOtpExpire = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 minutes

  await user.save();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f8fafc;font-family:Arial,sans-serif;-webkit-font-smoothing:antialiased;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8fafc;padding:40px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" max-width="600px" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <!-- Header -->
                <tr>
                  <td align="center" style="padding:32px 24px;background:#0F7F6C;color:#ffffff;">
                    <h1 style="margin:0;font-size:24px;font-weight:bold;letter-spacing:-0.5px;color:#ffffff;">Momo Restaurant</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding:40px 32px;color:#334155;">
                    <p style="margin:0 0 16px 0;font-size:16px;line-height:24px;">
                      Hello <strong>${user.fullName}</strong>,
                    </p>
                    <p style="margin:0 0 24px 0;font-size:15px;line-height:24px;color:#475569;">
                      We received a request to reset your password. Please use the One-Time Password (OTP) below to proceed. Do not share this code with anyone.
                    </p>
                    
                    <!-- OTP Box -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="padding:24px 0;background:#f1f5f9;border-radius:12px;border:1px dashed #cbd5e1;">
                          <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#0F7F6C;">
                            ${otp}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:24px 0 16px 0;font-size:14px;line-height:20px;color:#64748b;">
                      This OTP is valid for only <strong>10 minutes</strong>.
                    </p>
                    <p style="margin:0 0 32px 0;font-size:14px;line-height:20px;color:#64748b;">
                      If you didn't request a password reset, you can safely ignore this email. Your account remains secure.
                    </p>

                    <hr style="border:0;border-top:1px solid #e2e8f0;margin:32px 0;">

                    <!-- Footer -->
                    <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                      &copy; ${new Date().getFullYear()} Momo Restaurant. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  // Use a clean plain-text fallback version for email clients that don't support HTML
  const textFallback = `Hello ${user.fullName},\n\nWe received a request to reset your password. Your One-Time Password (OTP) is: ${otp}\n\nThis OTP is valid for 10 minutes. If you didn't request this, please ignore this email.\n\n© ${new Date().getFullYear()} Momo Restaurant`;

  await sendEmail(user.email, "Password Reset OTP", html, textFallback);

  return {
    success: true,
    message: "OTP sent successfully",
  };
};
