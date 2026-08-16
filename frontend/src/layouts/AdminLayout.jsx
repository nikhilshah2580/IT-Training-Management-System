import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = () => {
    return (
        <div className="flex">
            <AdminSidebar />

            <main className="flex-1 bg-gray-100 min-h-screen p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
