import express from "express";
import userRoutes from "./routes/user.routes.js";
import globalErrorMiddleware from "./middlewares/globalError.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import contactRoutes from "./routes/contact.routes.js";
import courseRoutes from "./routes/course.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import submissionRoutes from "./routes/submission.routes.js";


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
app.use("/api/courses", courseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);

app.use(globalErrorMiddleware);

export default app;
