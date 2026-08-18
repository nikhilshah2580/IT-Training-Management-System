import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import globalErrorMiddleware from "./middlewares/globalError.middleware.js";
import cookieParser from "cookie-parser";
import courseRoutes from "./routes/course.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import demoClassRoutes from "./routes/demoClass.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import testimonialRoutes from "./routes/testimonial.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import jobPlacementRoutes from "./routes/jobPlacement.routes.js";
import jobListingRoutes from "./routes/jobListing.routes.js";
import instructorProfileRoutes from "./routes/instructorProfile.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests such as Postman.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  }),
);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/demo-classes", demoClassRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/job-placements", jobPlacementRoutes);
app.use("/api/job-listings", jobListingRoutes);
app.use("/api/instructor-profiles", instructorProfileRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(globalErrorMiddleware);

export default app;
