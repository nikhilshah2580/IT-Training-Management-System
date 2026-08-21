import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Award,
  BookOpen,
  Briefcase,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Menu,
  MessageSquareQuote,
  Star,
  UserCircle,
  X,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Enrollments",
    path: "/student/enrollments",
    icon: GraduationCap,
  },
  {
    name: "My Courses",
    path: "/student/my-courses",
    icon: BookOpen,
  },
  {
    name: "Payment",
    path: "/student/payment",
    icon: CreditCard,
  },
  {
    name: "Assignments",
    path: "/student/assignments",
    icon: ClipboardList,
  },
  {
    name: "Certificates",
    path: "/student/certificates",
    icon: Award,
  },
  {
    name: "Attendance",
    path: "/student/attendance",
    icon: CalendarCheck,
  },
  {
    name: "Attendance Report",
    path: "/student/attendance/percentage",
    icon: CalendarCheck,
  },
  {
    name: "Resources",
    path: "/student/resources",
    icon: FileText,
  },
  {
    name: "Job Placements",
    path: "/student/job-placements",
    icon: Briefcase,
  },
  {
    name: "Reviews",
    path: "/student/reviews",
    icon: Star,
  },
  {
    name: "Testimonials",
    path: "/student/testimonials",
    icon: MessageSquareQuote,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: UserCircle,
  },
];

const StudentSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-gray-900 p-2 text-white shadow-lg md:hidden"
        aria-label="Open student menu"
      >
        <Menu size={22} />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 h-screen w-72 shrink-0 overflow-y-auto bg-gray-900 p-5 text-white transition-transform duration-300 md:sticky md:top-0 md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Student Panel</h2>
            <p className="mt-1 text-xs text-gray-400">IT Training Portal</p>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-gray-300 hover:bg-gray-800 hover:text-white md:hidden"
            aria-label="Close student menu"
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
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`
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

export default StudentSidebar;
