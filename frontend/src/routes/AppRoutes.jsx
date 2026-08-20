import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// ==================== PUBLIC ====================
import Home from "../pages/public/Home";
import Courses from "../pages/public/Courses";
import CourseDetails from "../pages/public/CourseDetails";
import NotFound from "../pages/public/NotFound";
import Unauthorized from "../pages/public/Unauthorized";
import Blog from "../pages/public/Blog";
import BlogDetails from "../pages/public/BlogDetails";
import Contact from "../pages/public/Contact";
import Instructors from "../pages/public/Instructors";
import Jobs from "../pages/public/Jobs";
import JobDetails from "../pages/public/JobDetails";
import DemoClass from "../pages/public/DemoClass";
import JobPlacements from "../pages/public/JobPlacements";

// ==================== AUTH ====================
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ResetPassword from "../pages/auth/ResetPassword";

// ==================== PROFILE ====================
import Profile from "../pages/profile/Profile";

// ==================== ADMIN ====================
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import CourseManagement from "../pages/admin/CourseManagement";
import AdminEditCourse from "../pages/admin/EditCourse";
import EnrollmentManagement from "../pages/admin/EnrollmentManagement";
import AdminCertificateManagement from "../pages/admin/CertificateManagement";
import AttendanceManagement from "../pages/admin/AttendanceManagement";
import BlogManagement from "../pages/admin/BlogManagement";
import ContactManagement from "../pages/admin/ContactManagement";
import InstructorManagement from "../pages/admin/InstructorManagement";
import JobManagement from "../pages/admin/JobManagement";
import CreateJob from "../pages/admin/CreateJob";
import EditJob from "../pages/admin/EditJob";
import JobPlacementManagement from "../pages/admin/JobPlacementManagement";
import CreateJobPlacement from "../pages/admin/CreateJobPlacement";
import EditJobPlacement from "../pages/admin/EditJobPlacement";
import DemoClassManagement from "../pages/admin/DemoClassManagement";
import ReviewManagement from "../pages/admin/ReviewManagement";
import TestimonialManagement from "../pages/admin/TestimonialManagement";

// ==================== INSTRUCTOR ====================
import InstructorDashboard from "../pages/instructor/InstructorDashboard";
import InstructorMyCourses from "../pages/instructor/MyCourses";
import CreateCourse from "../pages/instructor/CreateCourse";
import EditCourse from "../pages/instructor/EditCourse";
import CourseStudents from "../pages/instructor/CourseStudents";
import AssignmentManagement from "../pages/instructor/AssignmentManagement";
import CreateAssignment from "../pages/instructor/CreateAssignment";
import EditAssignment from "../pages/instructor/EditAssignment";
import AssignmentSubmissions from "../pages/instructor/AssignmentSubmissions";
import InstructorCertificateManagement from "../pages/instructor/CertificateManagement";
import ResourceManagement from "../pages/instructor/ResourceManagement";
import InstructorBlogManagement from "../pages/instructor/BlogManagement";
import InstructorProfile from "../pages/instructor/InstructorProfile";
import EditInstructorProfile from "../pages/instructor/EditInstructorProfile";

// ==================== STUDENT ====================
import StudentDashboard from "../pages/student/StudentDashboard";
import MyEnrollments from "../pages/student/MyEnrollments";
import StudentMyCourses from "../pages/student/MyCourses";
import Payment from "../pages/student/Payment";
import PaymentSuccess from "../pages/student/PaymentSuccess";
import PaymentFailure from "../pages/student/PaymentFailure";
import MyAssignments from "../pages/student/MyAssignments";
import AssignmentDetails from "../pages/student/AssignmentDetails";
import SubmitAssignment from "../pages/student/SubmitAssignment";
import MyCertificates from "../pages/student/MyCertificates";
import CertificateDetails from "../pages/student/CertificateDetails";
import MyAttendance from "../pages/student/MyAttendance";
import AttendancePercentage from "../pages/student/AttendancePercentage";
import CourseResources from "../pages/student/CourseResources";
import ResourceDetails from "../pages/student/ResourceDetails";
import MyJobPlacements from "../pages/student/MyJobPlacements";
import MyReviews from "../pages/student/MyReviews";
import MyTestimonials from "../pages/student/MyTestimonials";

// ==================== STUDENT FORMS / SHARED COMPONENTS ====================
import ReviewForm from "../components/reviews/ReviewForm";
import TestimonialForm from "../components/testimonial/TestimonialForm";

// ==================== NOTIFICATIONS ====================
import Notifications from "../pages/notifications/Notifications";

// ==================== ROUTE GUARDS ====================
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

// ==================== LAYOUTS ====================
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import InstructorLayout from "../layouts/InstructorLayout";
import StudentLayout from "../layouts/StudentLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth LAYOUT */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/demo-classes" element={<DemoClass />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/job-placements" element={<JobPlacements />} />
        </Route>

        {/* AUTHENTICATED */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* ADMIN */}
        <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="enrollments" element={<EnrollmentManagement />} />
            <Route path="courses/:id/edit" element={<AdminEditCourse />} />
            <Route
              path="certificates"
              element={<AdminCertificateManagement />}
            />
            <Route path="attendance" element={<AttendanceManagement />} />
            <Route path="blogs" element={<BlogManagement />} />
            <Route path="contacts" element={<ContactManagement />} />
            <Route path="instructors" element={<InstructorManagement />} />
            <Route path="jobs" element={<JobManagement />} />
            <Route path="jobs/create" element={<CreateJob />} />
            <Route path="jobs/:id/edit" element={<EditJob />} />
            <Route path="job-placements" element={<JobPlacementManagement />} />
            <Route
              path="job-placements/create"
              element={<CreateJobPlacement />}
            />
            <Route
              path="job-placements/:id/edit"
              element={<EditJobPlacement />}
            />
            <Route path="demo-classes" element={<DemoClassManagement />} />
            <Route path="reviews" element={<ReviewManagement />} />
            <Route path="testimonials" element={<TestimonialManagement />} />
          </Route>
        </Route>
        
        {/* INSTRUCTOR */}
        <Route element={<RoleProtectedRoute allowedRoles={["instructor"]} />}>
          <Route path="/instructor" element={<InstructorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route
              path="/instructor/dashboard"
              element={<InstructorDashboard />}
            />
            <Route
              path="/instructor/courses"
              element={<InstructorMyCourses />}
            />
            <Route
              path="/instructor/courses/create"
              element={<CreateCourse />}
            />
            <Route
              path="/instructor/courses/:id/edit"
              element={<EditCourse />}
            />
            <Route
              path="/instructor/courses/:id/students"
              element={<CourseStudents />}
            />
            <Route
              path="/instructor/assignments"
              element={<AssignmentManagement />}
            />
            <Route
              path="/instructor/assignments/create"
              element={<CreateAssignment />}
            />
            <Route
              path="/instructor/assignments/:id/edit"
              element={<EditAssignment />}
            />
            <Route
              path="/instructor/assignments/:id/submissions"
              element={<AssignmentSubmissions />}
            />
            <Route
              path="/instructor/certificates"
              element={<InstructorCertificateManagement />}
            />
            <Route
              path="/instructor/resources"
              element={<ResourceManagement />}
            />
            <Route
              path="/instructor/blogs"
              element={<InstructorBlogManagement />}
            />
            <Route path="/instructor/profile" element={<InstructorProfile />} />
            <Route
              path="/instructor/profile/edit"
              element={<EditInstructorProfile />}
            />
          </Route>
        </Route>
        {/* STUDENT */}
        <Route element={<RoleProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Dashboard */}
            <Route path="dashboard" element={<StudentDashboard />} />

            {/* Enrollments */}
            <Route path="enrollments" element={<MyEnrollments />} />
            <Route path="my-courses" element={<StudentMyCourses />} />

            {/* Payment */}
            <Route path="payment" element={<Payment />} />
            <Route path="payment/success" element={<PaymentSuccess />} />
            <Route path="payment/failure" element={<PaymentFailure />} />

            {/* Assignments */}
            <Route path="assignments" element={<MyAssignments />} />
            <Route path="assignments/:id" element={<AssignmentDetails />} />
            <Route
              path="assignments/:id/submit"
              element={<SubmitAssignment />}
            />

            {/* Certificates */}
            <Route path="certificates" element={<MyCertificates />} />
            <Route path="certificates/:id" element={<CertificateDetails />} />

            {/* Attendance */}
            <Route path="attendance" element={<MyAttendance />} />
            <Route
              path="attendance/percentage"
              element={<AttendancePercentage />}
            />

            {/* Resources */}
            <Route path="resources" element={<CourseResources />} />
            <Route path="resources/:id" element={<ResourceDetails />} />

            {/* Job Placements */}
            <Route path="job-placements" element={<MyJobPlacements />} />

            {/* Reviews */}
            <Route path="reviews" element={<MyReviews />} />
            <Route path="reviews/create" element={<ReviewForm />} />

            {/* Testimonials */}
            <Route path="testimonials" element={<MyTestimonials />} />
            <Route path="testimonials/create" element={<TestimonialForm />} />
          </Route>
        </Route>
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

