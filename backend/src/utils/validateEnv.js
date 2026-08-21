const requiredEnvByMode = {
  production: [
    "FRONTEND_URL",
    "MONGODB_URI",
    "JWT_SECRET_KEY",
    "JWT_REFRESH_SECRET_KEY",
  ],
};

export const validateEnv = () => {
  const mode = process.env.NODE_ENV || "development";
  const required = requiredEnvByMode[mode] || [];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};
