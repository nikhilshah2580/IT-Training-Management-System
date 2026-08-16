import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    Briefcase,
    MessageSquare,
    Bell,
    Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Users",
        path: "/admin/users",
        icon: Users,
    },
    {
        name: "Courses",
        path: "/admin/courses",
        icon: BookOpen,
    },
    {
        name: "Enrollments",
        path: "/admin/enrollments",
        icon: GraduationCap,
    },
    {
        name: "Job Listings",
        path: "/admin/job-listings",
        icon: Briefcase,
    },
    {
        name: "Contacts",
        path: "/admin/contacts",
        icon: MessageSquare,
    },
    {
        name: "Notifications",
        path: "/admin/notifications",
        icon: Bell,
    },
    {
        name: "Settings",
        path: "/admin/settings",
        icon: Settings,
    },
];

const AdminSidebar = () => {
    return (
        <aside className="w-72 bg-gray-900 text-white min-h-screen p-5">
            <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

            <nav className="space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${isActive ? "bg-blue-600" : "hover:bg-gray-800"
                                }`
                            }
                        >
                            <Icon size={20} />
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
};

export default AdminSidebar;
