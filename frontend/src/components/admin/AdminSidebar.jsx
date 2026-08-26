import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Award,
  BookOpen,
  Briefcase,
  CalendarDays,
  GraduationCap,
  House,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquare,
  NotebookTabs,
  Star,
  UserCheck,
  UserCircle,
  Users,
  X,
} from "lucide-react";

const menuItems = [
  {
    name: "Home",
    path: "/",
    icon: House,
  },
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
    name: "Job Inquiries",
    path: "/admin/job-inquiries",
    icon: Mail,
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
    icon: Star,
  },
  {
    name: "Testimonials",
    path: "/admin/testimonials",
    icon: MessageSquare,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: UserCircle,
  },
];

const AdminSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-gray-900 p-2 text-white shadow-lg md:hidden"
        aria-label="Open admin menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 h-screen w-72 shrink-0 overflow-y-auto bg-gray-900 p-5 text-white transition-transform duration-300 md:sticky md:top-0 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <p className="mt-1 text-xs text-gray-400">IT Training Portal</p>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-gray-300 hover:bg-gray-800 hover:text-white md:hidden"
            aria-label="Close admin menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
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
    </>
  );
};

export default AdminSidebar;
