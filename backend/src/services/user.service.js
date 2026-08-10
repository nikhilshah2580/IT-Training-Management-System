import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

//current user
export const getCurrentUserService = async (id) => {
  return await User.findById(id).select("-password -refreshToken");
};

//update profile
export const updateProfileService = async (id, data) => {
  const updates = {};

  if (data.fullName !== undefined) updates.fullName = data.fullName;
  if (data.email) {
    const exists = await User.findOne({
      email: data.email,
      _id: { $ne: id },
    });

    if (exists) {
      const err = new Error("Email already exists");
      err.statusCode = 400;
      throw err;
    }

    updates.email = data.email;
  }
  if (data.phone !== undefined) updates.phone = data.phone;
  if (data.address !== undefined) updates.address = data.address;
  if (data.photo) updates.photo = data.photo;

  return await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken");
};

export const getUsersService = async () => {
  return await User.find().select("-password -refreshToken");
};

//update user
export const updateUserService = async (id, data) => {
  const updates = {};

  if (data.fullName) updates.fullName = data.fullName;
  if (data.email) {
    const exists = await User.findOne({
      email: data.email,
      _id: { $ne: id },
    });

    if (exists) {
      const err = new Error("Email already exists");
      err.statusCode = 400;
      throw err;
    }

    updates.email = data.email;
  }
  if (data.role) updates.role = data.role;
  if (data.password) {
    updates.password = await bcrypt.hash(data.password, 10);
  }

  return await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken");
};

//delete user
export const deleteUserService = async (id) => {
  return await User.findByIdAndDelete(id);
};

//change password
export const changePasswordService = async (
  userId,
  currentPassword,
  newPassword,
) => {
  const user = await User.findById(userId);

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    const err = new Error("password do not match");
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  return user;
};
