import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ClipboardList,
  Award,
  CalendarCheck,
  Briefcase,
  Star,
  MessageSquareQuote,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

import { getMyEnrollments } from "../../api/enrollment.services";

// Vibrant color palette for charts
const COLORS = [
  "#4F46E5",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyEnrollments();

        const enrollmentData =
          response?.enrollments ||
          response?.data?.enrollments ||
          response?.data ||
          [];

        setEnrollments(Array.isArray(enrollmentData) ? enrollmentData : []);
      } catch (err) {
        console.error("Student dashboard error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const activeEnrollments = enrollments.filter(
    (item) => item?.status === "Active" || item?.paymentStatus === "Paid",
  ).length;

  const completedCourses = enrollments.filter(
    (item) => item?.status === "Completed" || Number(item?.progress) === 100,
  ).length;

  const stats = [
    {
      title: "Enrolled Courses",
      value: enrollments.length,
      icon: BookOpen,
      path: "/student/my-courses",
      bgGradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
      borderColor: "hover:border-blue-300",
      iconBg:
        "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20",
    },
    {
      title: "Active Learning",
      value: activeEnrollments,
      icon: CalendarCheck,
      path: "/student/my-courses",
      bgGradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
      borderColor: "hover:border-emerald-300",
      iconBg:
        "bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20",
    },
    {
      title: "Completed Certificates",
      value: completedCourses,
      icon: Award,
      path: "/student/certificates",
      bgGradient: "from-purple-500/10 via-pink-500/5 to-transparent",
      borderColor: "hover:border-purple-300",
      iconBg:
        "bg-gradient-to-tr from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/20",
    },
    {
      title: "Assignments",
      value: "Manage",
      icon: ClipboardList,
      path: "/student/assignments",
      bgGradient: "from-amber-500/10 via-orange-500/5 to-transparent",
      borderColor: "hover:border-amber-300",
      iconBg:
        "bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20",
    },
  ];

  // Chart Data Preparation
  const studentBarData = [
    { name: "Total", count: enrollments.length },
    { name: "Active", count: activeEnrollments },
    { name: "Completed", count: completedCourses },
  ];

  const studentPieData = [
    { name: "Completed", value: completedCourses },
    {
      name: "In Progress",
      value: Math.max(0, enrollments.length - completedCourses),
    },
  ];

  const quickActions = [
    {
      title: "Assignments",
      desc: "View submissions",
      icon: ClipboardList,
      path: "/student/assignments",
      color: "from-amber-500 to-orange-600",
      lightBg:
        "bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-600 group-hover:text-white",
    },
    {
      title: "Attendance",
      desc: "Check logs",
      icon: CalendarCheck,
      path: "/student/attendance",
      color: "from-emerald-500 to-teal-600",
      lightBg:
        "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white",
    },
    {
      title: "Certificates",
      desc: "Earned credentials",
      icon: Award,
      path: "/student/certificates",
      color: "from-purple-500 to-pink-600",
      lightBg:
        "bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-600 group-hover:text-white",
    },
    {
      title: "Job Placement",
      desc: "Opportunities",
      icon: Briefcase,
      path: "/student/job-placements",
      color: "from-blue-500 to-indigo-600",
      lightBg:
        "bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white",
    },
    {
      title: "Reviews",
      desc: "Manage feedback",
      icon: Star,
      path: "/student/reviews",
      color: "from-rose-500 to-pink-600",
      lightBg:
        "bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white",
    },
    {
      title: "Testimonials",
      desc: "Success stories",
      icon: MessageSquareQuote,
      path: "/student/testimonials",
      color: "from-cyan-500 to-blue-600",
      lightBg:
        "bg-cyan-50 text-cyan-600 border-cyan-100 group-hover:bg-cyan-600 group-hover:text-white",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={38} className="animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading your student portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-900 via-purple-900 to-blue-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-indigo-200 border border-white/15 mb-3">
              <Sparkles size={13} className="text-amber-300" /> Student
              Workspace
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-indigo-100 max-w-xl">
              Track your active modules, manage pending assignments, and check
              your overall academic progress in real-time.
            </p>
          </div>
          <button
            onClick={() => navigate("/courses")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-5 py-3 text-xs md:text-sm font-black text-slate-900 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            Explore New Courses <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-xs">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;

          return (
            <motion.button
              key={stat.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              type="button"
              onClick={() => navigate(stat.path)}
              className={`group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-xs transition-all hover:-translate-y-1 ${stat.borderColor} hover:shadow-xl hover:shadow-slate-200/50`}
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${stat.bgGradient} opacity-60 pointer-events-none`}
              />

              <div className="relative z-10 flex items-center justify-between">
                <div className={`rounded-xl p-3 ${stat.iconBg}`}>
                  <Icon size={20} />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-slate-900 group-hover:text-white">
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-0.5"
                  />
                </div>
              </div>

              <div className="relative z-10 mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {stat.title}
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-800 tracking-tight">
                  {stat.value}
                </h2>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ANALYTICS VISUALIZATION CHARTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Academic Status Bar Chart */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs flex flex-col justify-between"
        >
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">
              Enrollment Overview
            </h3>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Quick summary of your course metrics
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={studentBarData}
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

        {/* Completion Donut Chart */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs flex flex-col justify-between"
        >
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">
              Course Completion Ratio
            </h3>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Completed versus active learning modules
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={studentPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {studentPieData.map((entry, index) => (
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
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* My Learning / Recent Courses */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={18} className="text-purple-600" /> My Learning
                Progress
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Overview of your recently enrolled courses & milestones
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/student/my-courses")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {enrollments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 mb-3">
                  <BookOpen size={22} />
                </div>
                <p className="text-sm font-bold text-slate-700">
                  No active course enrollments found.
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Browse our catalog to enroll in exciting professional tracks
                  and start building your skills.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/courses")}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              enrollments.slice(0, 5).map((enrollment) => {
                const course = enrollment.course || {};

                const progress = Math.min(
                  Math.max(Number(enrollment.progress || 0), 0),
                  100,
                );

                const isCompleted =
                  progress === 100 || enrollment.status === "Completed";

                return (
                  <div
                    key={enrollment._id || enrollment.id}
                    className="group rounded-xl border border-slate-100 bg-slate-50/30 p-4 transition hover:border-indigo-200 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition">
                          {course.title || "Course"}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              isCompleted
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                : "bg-sky-50 text-sky-700 border border-sky-200/60"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 size={10} />
                            ) : (
                              <Clock size={10} />
                            )}
                            {enrollment.status ||
                              (isCompleted ? "Completed" : "In Progress")}
                          </span>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-xl bg-white px-3 py-1 text-xs font-black text-indigo-600 shadow-xs border border-slate-100">
                        {progress}%
                      </span>
                    </div>

                    <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions Hub */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-800">
                Quick Shortcuts
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Instant access to academic features & tracking tools
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={action.title}
                    type="button"
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-left transition hover:border-slate-300 hover:bg-white hover:shadow-md group"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition shadow-xs ${action.lightBg}`}
                    >
                      <ActionIcon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-xs truncate group-hover:text-slate-900 transition">
                        {action.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {action.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
