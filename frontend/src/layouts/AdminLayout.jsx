import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <AdminNavbar />

                <main className="flex-1 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
