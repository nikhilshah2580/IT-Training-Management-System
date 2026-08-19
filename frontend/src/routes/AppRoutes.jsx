import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import NotFound from "../pages/public/NotFound";
import Courses from "../pages/public/Courses";
import CourseDetails from "../pages/public/CourseDetails";
import Unauthorized from "../pages/public/Unauthorized";
import UserManagement from "../pages/admin/UserManagement";
import CourseManagement from "../pages/admin/CourseManagement";
import InstructorMyCourses from "../pages/instructor/MyCourses";
import CreateCourse from "../pages/instructor/CreateCourse";
import EditCourse from "../pages/instructor/EditCourse";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminEditCourse from "../pages/admin/EditCourse";
import MyEnrollments from "../pages/student/MyEnrollments";
import EnrollmentManagement from "../pages/admin/EnrollmentManagement";
import CourseStudents from "../pages/instructor/CourseStudents";
import StudentMyCourses from "../pages/student/MyCourses";
import Payment from "../pages/student/Payment";
import Profile from "../pages/profile/Profile";
import PaymentSuccess from "../pages/student/PaymentSuccess";
import PaymentFailure from "../pages/student/PaymentFailure";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ResetPassword from "../pages/auth/ResetPassword";
import CreateAssignment from "../pages/instructor/CreateAssignment";
import EditAssignment from "../pages/instructor/EditAssignment";
import AssignmentDetails from "../pages/student/AssignmentDetails";
import MyAssignments from "../pages/student/MyAssignments";
import AssignmentManagement from "../pages/instructor/AssignmentManagement";
import AssignmentSubmissions from "../pages/instructor/AssignmentSubmissions";
import SubmitAssignment from "../pages/student/SubmitAssignment";
import InstructorCertificateManagement from "../pages/instructor/CertificateManagement";
import AdminCertificateManagement from "../pages/admin/CertificateManagement";
import MyCertificates from "../pages/student/MyCertificates";
import CertificateDetails from "../pages/student/CertificateDetails";
import AttendanceManagement from "../pages/instructor/AttendanceManagement";
import MyAttendance from "../pages/student/MyAttendance";
import AttendancePercentage from "../pages/student/AttendancePercentage";
import ResourceManagement from "../pages/instructor/ResourceManagement";
import CourseResources from "../pages/student/CourseResources";
import ResourceDetails from "../pages/student/ResourceDetails";
import InstructorBlogManagement from "../pages/instructor/BlogManagement";
import AdminBlogManagement from "../pages/admin/BlogManagement";
import Blog from "../pages/public/Blog";
import BlogDetails from "../pages/public/BlogDetails";
import ContactManagement from "../pages/admin/ContactManagement";
import Contact from "../pages/public/Contact";
import Instructors from "../pages/public/Instructors";
import InstructorProfile from "../pages/instructor/InstructorProfile";
import InstructorManagement from "../pages/admin/InstructorManagement";
import EditInstructorProfile from "../pages/instructor/EditInstructorProfile";
import CreateJob from "../pages/admin/CreateJob";
import EditJob from "../pages/admin/EditJob";
import JobManagement from "../pages/admin/JobManagement";
import Jobs from "../pages/public/Jobs";
import DemoClass from "../pages/public/DemoClass";
import DemoClassManagement from "../pages/admin/DemoClassManagement";
import JobDetails from "../pages/public/JobDetails";
import JobPlacementManagement from "../pages/admin/JobPlacementManagement";
import CreateJobPlacement from "../pages/admin/CreateJobPlacement";
import EditJobPlacement from "../pages/admin/EditJobPlacement";
import JobPlacements from "../pages/public/JobPlacements";
import MyJobPlacements from "../pages/student/MyJobPlacements";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";

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
                        <Route path="certificates" element={<AdminCertificateManagement />} />
                        <Route path="attendance" element={<AttendanceManagement />} />
                        <Route path="blogs" element={<AdminBlogManagement />} />
                        <Route path="contacts" element={<ContactManagement />} />
                        <Route path="instructors" element={<InstructorManagement />} />
                        <Route path="jobs" element={<JobManagement />} />
                        <Route path="jobs/create" element={<CreateJob />} />
                        <Route path="jobs/:id/edit" element={<EditJob />} />
                        <Route path="job-placements" element={<JobPlacementManagement />} />
                        <Route path="job-placements/create" element={<CreateJobPlacement />} />
                        <Route path="job-placements/:id/edit" element={<EditJobPlacement />} />
                        <Route path="demo-classes" element={<DemoClassManagement />} />

                    </Route>
                </Route>

                {/* INSTRUCTOR */}
                <Route element={<RoleProtectedRoute allowedRoles={["instructor"]} />}>
                    <Route path="/instructor/dashboard" element={<h1>Instructor Dashboard</h1>} />
                    <Route path="/instructor/courses" element={<InstructorMyCourses />} />
                    <Route path="/instructor/courses/create" element={<CreateCourse />} />
                    <Route path="/instructor/courses/:id/edit" element={<EditCourse />} />
                    <Route path="/instructor/courses/:id/students" element={<CourseStudents />} />
                    <Route path="/instructor/assignments" element={<AssignmentManagement />} />
                    <Route path="/instructor/assignments/create" element={<CreateAssignment />} />
                    <Route path="/instructor/assignments/:id/edit" element={<EditAssignment />} />
                    <Route path="/instructor/assignments/:id/submissions" element={<AssignmentSubmissions />} />
                    <Route path="/instructor/certificates" element={<InstructorCertificateManagement />} />
                    <Route path="/instructor/resources" element={<ResourceManagement />} />
                    <Route path="/instructor/blogs" element={<InstructorBlogManagement />} />
                    <Route path="/instructor/profile" element={<InstructorProfile />} />
                    <Route path="/instructor/profile/edit" element={<EditInstructorProfile />} />

                </Route> 

                {/* STUDENT */}
                <Route element={<RoleProtectedRoute allowedRoles={["student"]} />}>
                    <Route path="/student/dashboard" element={<h1>Student Dashboard</h1>} />
                    <Route path="/student/enrollments" element={<MyEnrollments />} />
                    <Route path="/student/my-courses" element={<StudentMyCourses />} />
                    <Route path="/student/payment" element={<Payment />} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/failure" element={<PaymentFailure />} />
                    <Route path="/student/assignments" element={<MyAssignments />} />
                    <Route path="/student/assignments/:id" element={<AssignmentDetails />} /> 
                    <Route path="/student/assignments/:id/submit" element={<SubmitAssignment />} />
                    <Route path="/student/certificates" element={<MyCertificates />} />
                    <Route path="/student/certificates/:id" element={<CertificateDetails />} />
                    <Route path="/student/attendance" element={<MyAttendance />} />
                    <Route path="/student/attendance/percentage" element={<AttendancePercentage />} />
                    <Route path="/student/resources" element={<CourseResources />} />
                    <Route path="/student/resources/:id" element={<ResourceDetails />} />
                    <Route path="/student/job-placements" element={<MyJobPlacements />} />

                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter >
    );
};

export default AppRoutes;
