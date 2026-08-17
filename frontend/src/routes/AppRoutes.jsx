import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";
import UserManagement from "../pages/admin/UserManagement";
import CourseManagement from "../pages/admin/CourseManagement";
import MyCourses from "../pages/instructor/MyCourses";
import CreateCourse from "../pages/instructor/CreateCourse";
import EditCourse from "../pages/instructor/EditCourse";
import AdminEditCourse from "../pages/admin/EditCourse";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* PUBLIC */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                </Route>

                {/* AUTHENTICATED */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<h1>Profile</h1>} />
                </Route>

                {/* ADMIN */}
                <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="courses" element={<CourseManagement />} />
                        <Route path="courses/:id/edit" element={<AdminEditCourse />} />
                    </Route>
                </Route>

            {/* INSTRUCTOR */}
            <Route element={<RoleProtectedRoute allowedRoles={["instructor"]} />}>
                <Route path="/instructor/dashboard" element={<h1>Instructor Dashboard</h1>} />
                <Route path="/instructor/courses" element={<MyCourses />} />
                <Route path="/instructor/courses/create" element={<CreateCourse />} />
                <Route path="/instructor/courses/:id/edit" element={<EditCourse />} />
            </Route>

            {/* STUDENT */}
            <Route element={<RoleProtectedRoute allowedRoles={["student"]} />}>
                <Route path="/student/dashboard" element={<h1>Student Dashboard</h1>} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter >
    );
};

export default AppRoutes;
