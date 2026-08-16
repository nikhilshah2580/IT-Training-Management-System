import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import PublicLayout from "../layouts/PublicLayout";

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
                    <Route path="/admin/dashboard" element={<h1>Admin Dashboard</h1>} />
                </Route>

                {/* INSTRUCTOR */}
                <Route element={<RoleProtectedRoute allowedRoles={["instructor"]} />}>
                    <Route path="/instructor/dashboard" element={<h1>Instructor Dashboard</h1>} />
                </Route>

                {/* STUDENT */}
                <Route element={<RoleProtectedRoute allowedRoles={["student"]} />}>
                    <Route path="/student/dashboard" element={<h1>Student Dashboard</h1>} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
