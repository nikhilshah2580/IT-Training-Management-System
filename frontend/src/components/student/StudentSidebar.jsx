import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    CreditCard,
    ClipboardList,
    Award,
    CalendarCheck,
    FileText,
    Briefcase,
    Star,
    MessageSquareQuote,
    UserCircle,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";

const StudentSidebar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        {
            label: "Dashboard",
            path: "/student/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "My Enrollments",
            path: "/student/enrollments",
            icon: BookOpen,
        },
        {
            label: "My Courses",
            path: "/student/my-courses",
            icon: BookOpen,
        },
        {
            label: "Payment",
            path: "/student/payment",
            icon: CreditCard,
        },
        {
            label: "Assignments",
            path: "/student/assignments",
            icon: ClipboardList,
        },
        {
            label: "Certificates",
            path: "/student/certificates",
            icon: Award,
        },
        {
            label: "Attendance",
            path: "/student/attendance",
            icon: CalendarCheck,
        },
        {
            label: "Resources",
            path: "/student/resources",
            icon: FileText,
        },
        {
            label: "Job Placements",
            path: "/student/job-placements",
            icon: Briefcase,
        },
        {
            label: "Reviews",
            path: "/student/reviews",
            icon: Star,
        },
        {
            label: "Testimonials",
            path: "/student/testimonials",
            icon: MessageSquareQuote,
        },
        {
            label: "Profile",
            path: "/profile",
            icon: UserCircle,
        },
    ];

    return (
        <>
            {/* Mobile button */}
            <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="fixed left-4 top-4 z-40 rounded-lg bg-slate-900 p-2 text-white shadow-lg md:hidden"
            >
                <Menu size={22} />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex w-64 flex-col
                    bg-slate-900 text-white
                    transition-transform duration-300
                    md:static md:translate-x-0
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b border-slate-700 px-5">
                    <div>
                        <h1 className="text-lg font-bold">
                            IT Training
                        </h1>

                        <p className="text-xs text-slate-400">
                            Student Panel
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="md:hidden"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={19} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t border-slate-700 p-4">
                    <p className="text-center text-xs text-slate-500">
                        Student Portal
                    </p>
                </div>
            </aside>
        </>
    );
};

export default StudentSidebar;