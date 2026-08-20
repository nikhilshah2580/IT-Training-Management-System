import {
    Award,
    BookOpen,
    Briefcase,
    CalendarDays,
    GraduationCap,
    LayoutDashboard,
    Mail,
    MessageSquare,
    NotebookTabs,
    ShieldCheck,
    Star,
    UserCheck,
    Users,
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
        name: "Certificates",
        path: "/admin/certificates",
        icon: Award,
    },
    {
        name: "Attendance",
        path: "/admin/attendance",
        icon: NotebookTabs,
    },
    {
        name: "Blogs",
        path: "/admin/blogs",
        icon: MessageSquare,
    },
    {
        name: "Contacts",
        path: "/admin/contacts",
        icon: Mail,
    },
    {
        name: "Instructors",
        path: "/admin/instructors",
        icon: UserCheck,
    },
    {
        name: "Jobs",
        path: "/admin/jobs",
        icon: Briefcase,
    },
    {
        name: "Job Placements",
        path: "/admin/job-placements",
        icon: Briefcase,
    },
    {
        name: "Demo Classes",
        path: "/admin/demo-classes",
        icon: CalendarDays,
    },
    {
        name: "Reviews",
        path: "/admin/reviews",
        icon: ShieldCheck,
    Star,
    },
    {
        name: "Testimonials",
        path: "/admin/testimonials",
        icon: MessageSquare,
    },
];

const AdminSidebar = () => {
    return (
        <aside className="sticky top-0 h-screen w-72 shrink-0 overflow-y-auto bg-gray-900 p-5 text-white">
            <h2 className="mb-8 text-2xl font-bold">Admin Panel</h2>

            <nav className="space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${isActive ? "bg-blue-600" : "hover:bg-gray-800"
                                }`
                            }
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
};

export default AdminSidebar;

