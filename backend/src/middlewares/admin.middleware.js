export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    const err = new Error("Access denied. Admin only.");
    err.statusCode = 403;
    throw err;
  }

  next();
};
