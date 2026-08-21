import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Award,
  BookOpen,
  Briefcase,
  CreditCard,
  GraduationCap,
  Loader2,
  RefreshCw,
  UserCheck,
  Users,
  TrendingUp,
  ArrowUpRight,
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 size={40} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl bg-red-50 p-8 text-center border border-red-100 shadow-sm max-w-md mx-auto mt-20">
        <p className="font-semibold text-red-700">
          {error?.response?.data?.message || "Failed to load dashboard"}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition"
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
      "/admin/users",
    ],
    [
      "Students",
      dashboardData?.users?.students ?? 0,
      GraduationCap,
      "from-cyan-500 to-blue-600",
      "/admin/users",
    ],
    [
      "Instructors",
      dashboardData?.users?.instructors ?? 0,
      UserCheck,
      "from-emerald-500 to-teal-600",
      "/admin/instructors",
    ],
    [
      "Active Courses",
      dashboardData?.courses?.active ?? 0,
      BookOpen,
      "from-amber-500 to-orange-600",
      "/admin/courses",
    ],
    [
      "Job Placements",
      dashboardData?.placements?.total ?? 0,
      Briefcase,
      "from-purple-500 to-indigo-600",
      "/admin/job-placements",
    ],
    [
      "Paid Payments",
      dashboardData?.payments?.successful ?? 0,
      CreditCard,
      "from-green-500 to-emerald-600",
      "/admin/enrollments",
    ],
    [
      "Certificates",
      dashboardData?.certificates?.total ?? 0,
      Award,
      "from-violet-500 to-purple-600",
      "/admin/certificates",
    ],
  ];

  // Chart Data Preparation
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

  // Overview Bar Chart Data for Platform Core Metrics
  const platformOverviewBarData = [
    { name: "Users", count: dashboardData?.users?.total ?? 0 },
    { name: "Courses", count: dashboardData?.courses?.total ?? 0 },
    { name: "Enrollments", count: dashboardData?.enrollments?.total ?? 0 },
    { name: "Placements", count: dashboardData?.placements?.total ?? 0 },
    { name: "Blogs", count: dashboardData?.blogs?.total ?? 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Dashboard Overview{" "}
            <TrendingUp className="text-indigo-600" size={26} />
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-normal">
            Real-time analytics and system metrics for your training ecosystem.
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 disabled:opacity-50 transition"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh Stats
        </motion.button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {topStats.map(([title, value, Icon, gradient, path], index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 transition hover:shadow-2xl group"
          >
            <div
              className={`absolute top-0 left-0 h-1.5 w-full bg-linear-to-r ${gradient}`}
            />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                  {title}
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {value}
                </p>
              </div>
              <div
                className={`rounded-2xl bg-linear-to-br ${gradient} p-3.5 text-white shadow-lg`}
              >
                <Icon size={22} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
              <Link
                to={path}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 transition"
              >
                View report <ArrowUpRight size={14} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Visualizations */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Core Ecosystem Growth Bar Chart */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40 flex flex-col justify-between"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Platform Core Volume
            </h3>
            <p className="text-xs text-slate-400 font-normal">
              Comparison of core system modules
            </p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={platformOverviewBarData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "16px",
                    border: "none",
                    color: "#fff",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ color: "#fff", fontWeight: "500" }}
                />
                <Bar dataKey="count" fill="#4F46E5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* User Role Distribution Donut Chart */}
        <ChartCard title="User Role Distribution" data={userRoleData} />
      </div>

      {/* Secondary Row of Analytics Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Course Health Status Breakdown"
          data={courseStatusData}
        />
        <ChartCard title="Payment Processing Status" data={paymentStatusData} />
      </div>
    </motion.div>
  );
};

// Reusable Modern Donut Chart Component
const ChartCard = ({ title, data }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40 flex flex-col justify-between"
  >
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-400 font-normal">
        Breakdown distribution metrics
      </p>
    </div>
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={8}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                strokeWidth={0}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderRadius: "16px",
              border: "none",
              color: "#fff",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            }}
            itemStyle={{ color: "#fff", fontWeight: "500" }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-xs font-medium text-slate-600">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

export default AdminDashboard;
