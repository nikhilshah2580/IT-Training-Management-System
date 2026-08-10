import express from "express";
import userRoutes from "./routes/user.routes.js";
import globalErrorMiddleware from "./middlewares/globalError.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import contactRoutes from "./routes/contact.routes.js";


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173"
    ],
    credentials: true,
  })
);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);

app.use(globalErrorMiddleware);

export default app;
