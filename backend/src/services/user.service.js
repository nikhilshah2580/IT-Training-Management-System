import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import User from "../models/user.model.js";

/* ----------------------------------------
   SAFE USER FIELDS
----------------------------------------- */

const safeUserFields = "-password -refreshToken -resetOtp -resetOtpExpire -verificationOtp -verificationOtpExpire";

/* ----------------------------------------
   CURRENT USER
----------------------------------------- */

export const getCurrentUserService = async (id) => {
  const user = await User.findById(id).select(safeUserFields);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/* ----------------------------------------
   UPDATE PROFILE
----------------------------------------- */

export const updateProfileService = async (id, data) => {
  const updates = {};

  if (data.fullName !== undefined) {
    updates.fullName = data.fullName.trim();
  }

  if (data.email !== undefined) {
    const email = data.email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email,
      _id: { $ne: id },
    });

    if (existingUser) {
      const error = new Error("Email already exists");
      error.statusCode = 400;
      throw error;
    }

    updates.email = email;

    // Email must be verified again after changing it.
    updates.isVerified = false;
  }

  if (data.phone !== undefined) {
    updates.phone = data.phone.trim();
  }

  if (data.address !== undefined) {
    updates.address = data.address.trim();
  }

  if (data.photo !== undefined) {
    updates.photo = data.photo;
  }

  const user = await User.findByIdAndUpdate(id, updates, {
    returnDocument: "after",
    runValidators: true,
  }).select(safeUserFields);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/* ----------------------------------------
   GET ALL USERS
   ADMIN
----------------------------------------- */

export const getUsersService = async ({ role, search, page = 1, limit = 20 } = {}) => {
  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (search) {
    filter.$or = [
      {
        fullName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const currentPage = Math.max(Number(page) || 1, 1);

  const perPage = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const skip = (currentPage - 1) * perPage;

  const [users, total] = await Promise.all([
    User.find(filter).select(safeUserFields).sort({ createdAt: -1 }).skip(skip).limit(perPage),

    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      page: currentPage,
      limit: perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  };
};

/* ----------------------------------------
   GET SINGLE USER
   ADMIN
----------------------------------------- */

export const getUserService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid user ID");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(id).select(safeUserFields);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/* ----------------------------------------
   ADMIN CREATE USER
----------------------------------------- */

export const createUserService = async (data) => {
  const { fullName, email, password, phone = "", address = "", photo = "", role = "student" } = data;

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    fullName,
    email: normalizedEmail,
    password: hashedPassword,
    phone,
    address,
    photo,
    role,
    authProvider: "local",
    isVerified: true,
  });

  return await User.findById(user._id).select(safeUserFields);
};

/* ----------------------------------------
   ADMIN UPDATE USER
----------------------------------------- */

export const updateUserService = async (id, data) => {
  const updates = {};

  if (data.fullName !== undefined) {
    updates.fullName = data.fullName.trim();
  }

  if (data.email !== undefined) {
    const email = data.email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email,
      _id: { $ne: id },
    });

    if (existingUser) {
      const error = new Error("Email already exists");
      error.statusCode = 400;
      throw error;
    }

    updates.email = email;
  }

  if (data.phone !== undefined) {
    updates.phone = data.phone.trim();
  }

  if (data.address !== undefined) {
    updates.address = data.address.trim();
  }

  if (data.photo !== undefined) {
    updates.photo = data.photo;
  }

  if (data.role !== undefined) {
    const validRoles = ["admin", "student", "instructor"];

    if (!validRoles.includes(data.role)) {
      const error = new Error("Invalid user role");
      error.statusCode = 400;
      throw error;
    }

    updates.role = data.role;
  }

  if (data.isVerified !== undefined) {
    updates.isVerified = Boolean(data.isVerified);
  }

  if (data.password) {
    updates.password = await bcrypt.hash(data.password, 12);

    // Invalidate existing sessions
    updates.refreshToken = "";
  }

  const user = await User.findByIdAndUpdate(id, updates, {
    returnDocument: "after",
    runValidators: true,
  }).select(safeUserFields);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/* ----------------------------------------
   DELETE USER
   ADMIN
----------------------------------------- */

export const deleteUserService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid user ID");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/* ----------------------------------------
   CHANGE PASSWORD
----------------------------------------- */

export const changePasswordService = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password +refreshToken");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (!user.password) {
    const error = new Error("Google accounts cannot change password here");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  if (currentPassword === newPassword) {
    const error = new Error("New password must be different");
    error.statusCode = 400;
    throw error;
  }

  user.password = await bcrypt.hash(newPassword, 12);

  // Force login again after password change.
  user.refreshToken = "";

  await user.save();

  return true;
};
