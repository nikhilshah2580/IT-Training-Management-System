import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      const error = new Error("Authentication required. Token not provided.");
      error.statusCode = 401;
      throw error;
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        const err = new Error("Access token expired.");
        err.statusCode = 401;
        throw err;
      }

      if (error.name === "JsonWebTokenError") {
        const err = new Error("Invalid access token.");
        err.statusCode = 401;
        throw err;
      }

      throw error;
    }

    if (!decoded?.id) {
      const error = new Error("Invalid token payload.");
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findById(decoded.id).select(
      "-password -refreshToken",
    );

    if (!user) {
      const error = new Error("User account not found.");
      error.statusCode = 404;
      throw error;
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};