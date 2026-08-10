import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    const err = new Error("Token not provided");
    err.statusCode = 401;
    throw err;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id).select(
      "-password -refreshToken",
    );

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      const err = new Error("Invalid token");
      err.statusCode = 401;
      throw err;
    }

    if (error.name === "TokenExpiredError") {
      const err = new Error("Token expired");
      err.statusCode = 401;
      throw err;
    }

    throw error;
  }
};
