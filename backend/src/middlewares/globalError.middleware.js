const globalErrorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (statusCode === 500) {
    console.error("Unhandled Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    status: statusCode,
  });
};

export default globalErrorMiddleware;