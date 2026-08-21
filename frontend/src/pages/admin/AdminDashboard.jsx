import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import {
  Award,
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  Loader2,
  MessageSquare,
  RefreshCw,
  Star,
  UserCheck,
  Users,
  TrendingUp,
} from "lucide-react";
import { getDashboard } from "../../api/dashboard.services";

// Vibrant color palette for charts and cards
const COLORS = [
  "#4F46E5",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

const AdminDashboard = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 size={40} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-center border border-red-100 shadow-sm">
        <p className="font-semibold text-red-700">
          {error?.response?.data?.message || "Failed to load dashboard"}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-indigo-700 transition"
        >
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  const dashboardData = data?.dashboard || {};

  const topStats = [
    [
      "Total Users",
      dashboardData?.users?.total ?? 0,
      Users,
      "from-blue-500 to-indigo-600",
    ],
    [
      "Students",
      dashboardData?.users?.students ?? 0,
      GraduationCap,
      "from-cyan-500 to-blue-600",
    ],
    [
      "Instructors",
      dashboardData?.users?.instructors ?? 0,
      UserCheck,
      "from-emerald-500 to-teal-600",
    ],
    [
      "Active Courses",
      dashboardData?.courses?.active ?? 0,
      BookOpen,
      "from-amber-500 to-orange-600",
    ],
    [
      "Job Placements",
      dashboardData?.placements?.total ?? 0,
      Briefcase,
      "from-purple-500 to-indigo-600",
    ],
    [
      "Pending Inquiries",
      dashboardData?.contacts?.pending ?? 0,
      MessageSquare,
      "from-pink-500 to-rose-600",
    ],
    [
      "Paid Payments",
      dashboardData?.payments?.successful ?? 0,
      CreditCard,
      "from-green-500 to-emerald-600",
    ],
    [
      "Certificates",
      dashboardData?.certificates?.total ?? 0,
      Award,
      "from-violet-500 to-purple-600",
    ],
  ];

  // Chart Data preparation
  const userRoleData = [
    { name: "Students", value: dashboardData?.users?.students ?? 0 },
    { name: "Instructors", value: dashboardData?.users?.instructors ?? 0 },
    { name: "Admins", value: dashboardData?.users?.admins ?? 0 },
  ];

  const courseStatusData = [
    { name: "Active", value: dashboardData?.courses?.active ?? 0 },
    { name: "Pending", value: dashboardData?.courses?.pending ?? 0 },
    { name: "Inactive", value: dashboardData?.courses?.inactive ?? 0 },
    { name: "Rejected", value: dashboardData?.courses?.rejected ?? 0 },
  ];

  const paymentStatusData = [
    { name: "Paid", value: dashboardData?.payments?.successful ?? 0 },
    { name: "Pending", value: dashboardData?.payments?.pending ?? 0 },
    { name: "Failed", value: dashboardData?.payments?.failed ?? 0 },
  ];

  const dashboardSections = [
    {
      title: "Users Overview",
      path: "/admin/users",
      icon: Users,
      items: [
        ["Total", dashboardData?.users?.total],
        ["Students", dashboardData?.users?.students],
        ["Instructors", dashboardData?.users?.instructors],
        ["Admins", dashboardData?.users?.admins],
        ["Verified", dashboardData?.users?.verified],
      ],
    },
    {
      title: "Courses Management",
      path: "/admin/courses",
      icon: BookOpen,
      items: [
        ["Total", dashboardData?.courses?.total],
        ["Pending", dashboardData?.courses?.pending],
        ["Active", dashboardData?.courses?.active],
        ["Inactive", dashboardData?.courses?.inactive],
        ["Rejected", dashboardData?.courses?.rejected],
      ],
    },
    {
      title: "Enrollments",
      path: "/admin/enrollments",
      icon: GraduationCap,
      items: [
        ["Total", dashboardData?.enrollments?.total],
        ["Active", dashboardData?.enrollments?.active],
        ["Completed", dashboardData?.enrollments?.completed],
      ],
    },
    {
      title: "Payments & Revenue",
      path: "/admin/enrollments",
      icon: CreditCard,
      items: [
        ["Total", dashboardData?.payments?.total],
        ["Paid", dashboardData?.payments?.successful],
        ["Pending", dashboardData?.payments?.pending],
        ["Failed", dashboardData?.payments?.failed],
      ],
    },
    {
      title: "Assignments & Submissions",
      path: "/admin/attendance",
      icon: ClipboardCheck,
      items: [
        ["Assignments", dashboardData?.assignments?.total],
        ["Active", dashboardData?.assignments?.active],
        ["Closed", dashboardData?.assignments?.closed],
        ["Submissions", dashboardData?.submissions?.total],
        ["Graded", dashboardData?.submissions?.graded],
        ["Late", dashboardData?.submissions?.late],
      ],
    },
    {
      title: "Attendance Tracker",
      path: "/admin/attendance",
      icon: ClipboardCheck,
      items: [
        ["Total Logs", dashboardData?.attendance?.total],
        ["Present", dashboardData?.attendance?.present],
        ["Absent", dashboardData?.attendance?.absent],
        ["Late", dashboardData?.attendance?.late],
      ],
    },
    {
      title: "Certificates",
      path: "/admin/certificates",
      icon: Award,
      items: [["Total Issued", dashboardData?.certificates?.total]],
    },
    {
      title: "Learning Resources",
      path: "/admin/courses",
      icon: FileText,
      items: [
        ["Total", dashboardData?.resources?.total],
        ["Published", dashboardData?.resources?.published],
      ],
    },
    {
      title: "Blogs & Articles",
      path: "/admin/blogs",
      icon: FileText,
      items: [
        ["Total", dashboardData?.blogs?.total],
        ["Published", dashboardData?.blogs?.published],
        ["Draft", dashboardData?.blogs?.draft],
        ["Archived", dashboardData?.blogs?.archived],
        ["Featured", dashboardData?.blogs?.featured],
      ],
    },
    {
      title: "Demo Classes",
      path: "/admin/demo-classes",
      icon: CalendarDays,
      items: [
        ["Total", dashboardData?.demoClasses?.total],
        ["Scheduled", dashboardData?.demoClasses?.scheduled],
        ["Completed", dashboardData?.demoClasses?.completed],
        ["Cancelled", dashboardData?.demoClasses?.cancelled],
      ],
    },
    {
      title: "Job Listings",
      path: "/admin/jobs",
      icon: Briefcase,
      items: [
        ["Total", dashboardData?.jobListings?.total],
        ["Published", dashboardData?.jobListings?.published],
        ["Draft", dashboardData?.jobListings?.draft],
        ["Closed", dashboardData?.jobListings?.closed],
        ["Expired", dashboardData?.jobListings?.expired],
      ],
    },
    {
      title: "Job Placements",
      path: "/admin/job-placements",
      icon: Briefcase,
      items: [
        ["Total", dashboardData?.placements?.total],
        ["Placed", dashboardData?.placements?.placed],
        ["Joined", dashboardData?.placements?.joined],
        ["Pending", dashboardData?.placements?.pending],
      ],
    },
    {
      title: "Reviews & Ratings",
      path: "/admin/reviews",
      icon: Star,
      items: [
        ["Total", dashboardData?.reviews?.total],
        ["Pending", dashboardData?.reviews?.pending],
        ["Approved", dashboardData?.reviews?.approved],
        ["Rejected", dashboardData?.reviews?.rejected],
      ],
    },
    {
      title: "Testimonials",
      path: "/admin/testimonials",
      icon: MessageSquare,
      items: [
        ["Total", dashboardData?.testimonials?.total],
        ["Pending", dashboardData?.testimonials?.pending],
        ["Approved", dashboardData?.testimonials?.approved],
        ["Rejected", dashboardData?.testimonials?.rejected],
        ["Featured", dashboardData?.testimonials?.featured],
      ],
    },
    {
      title: "Instructor Profiles",
      path: "/admin/instructors",
      icon: UserCheck,
      items: [
        ["Total", dashboardData?.instructorProfiles?.total],
        ["Pending", dashboardData?.instructorProfiles?.pending],
        ["Approved", dashboardData?.instructorProfiles?.approved],
        ["Rejected", dashboardData?.instructorProfiles?.rejected],
      ],
    },
    {
      title: "Inquiries & Contacts",
      path: "/admin/contacts",
      icon: MessageSquare,
      items: [
        ["Total", dashboardData?.contacts?.total],
        ["Pending", dashboardData?.contacts?.pending],
      ],
    },
    {
      title: "System Notifications",
      path: "/notifications",
      icon: Bell,
      items: [
        ["Total", dashboardData?.notifications?.total],
        ["Unread", dashboardData?.notifications?.unread],
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      {/* Header Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2">
            Dashboard Overview{" "}
            <TrendingUp className="text-indigo-600" size={24} />
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Real-time analytics and system metrics for your training ecosystem.
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-gray-800 disabled:opacity-50 transition"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh Stats
        </motion.button>
      </div>

      {/* Top Stat Cards with Gradient Accents */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {topStats.map(([title, value, Icon, gradient], index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-xl"
          >
            <div className="absolute top-0 left-0 h-1.5 w-full bg-linear-to-r ${gradient}" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold tracking-wider uppercase text-gray-400">
                  {title}
                </p>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">
                  {value}
                </p>
              </div>
              <div
                className={`rounded-2xl bg-linear-to-br ${gradient} p-3.5 text-white shadow-lg`}
              >
                <Icon size={22} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Visualizations (Pie Charts Section) */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="User Role Distribution" data={userRoleData} />
        <ChartCard title="Course Health Status" data={courseStatusData} />
        <ChartCard title="Payment Processing Status" data={paymentStatusData} />
      </div>

      {/* Detailed Management Panels */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Detailed Modules
        </h3>
        <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
          {dashboardSections.map((section, idx) => (
            <DashboardPanel key={section.title} {...section} index={idx} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Reusable Donut Chart Component
const ChartCard = ({ title, data }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between"
  >
    <h3 className="text-base font-bold text-gray-800 mb-2">{title}</h3>
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={6}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              borderRadius: "12px",
              border: "none",
              color: "#fff",
            }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

// Animated Panel Component
const DashboardPanel = ({ title, items, path, icon: Icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.03 }}
  >
    <Link
      to={path}
      className="group block rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        {Icon && (
          <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="mt-4 space-y-2.5">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-gray-50 pb-2.5 last:border-0 last:pb-0"
          >
            <span className="text-sm font-medium text-gray-500">{label}</span>
            <span className="font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md">
              {value ?? 0}
            </span>
          </div>
        ))}
      </div>
    </Link>
  </motion.div>
);

export default AdminDashboard;
