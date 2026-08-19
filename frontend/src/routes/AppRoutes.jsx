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
                    </Route>
                </Route>

                {/* INSTRUCTOR */}
                <Route element={<RoleProtectedRoute allowedRoles={["instructor"]} />}>
                    <Route path="/instructor/dashboard" element={<h1>Instructor Dashboard</h1>} />
                    <Route path="/instructor/courses" element={<InstructorMyCourses />} />
                    <Route path="/instructor/courses/create" element={<CreateCourse />} />
                    <Route path="/instructor/courses/:id/edit" element={<EditCourse />} />
                    <Route path="/instructor/courses/:id/students" element={<CourseStudents />} />
                </Route> 

                {/* STUDENT */}
                <Route element={<RoleProtectedRoute allowedRoles={["student"]} />}>
                    <Route path="/student/dashboard" element={<h1>Student Dashboard</h1>} />
                    <Route path="/student/enrollments" element={<MyEnrollments />} />
                    <Route path="/student/my-courses" element={<StudentMyCourses />} />
                    <Route path="/student/payment" element={<Payment />} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/failure" element={<PaymentFailure />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter >
    );
};

export default AppRoutes;
