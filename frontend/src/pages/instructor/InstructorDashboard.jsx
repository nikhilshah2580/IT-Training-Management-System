import React, { useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardList,
  Users,
  Award,
  FileText,
  Plus,
  ArrowRight,
  Loader2,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  GraduationCap,
  Clock,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

import { getInstructorDashboard } from "../../api/dashboard.services";

// Vibrant color palette for charts
const COLORS = [
  "#4F46E5",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

const InstructorDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getInstructorDashboard();
        setDashboard(
          response?.dashboard ||
            response?.data?.dashboard ||
            response?.data ||
            null,
        );
      } catch (err) {
        console.error("Instructor dashboard error:", err);
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

  const statsData = dashboard?.stats || {};
  const courses = dashboard?.recentCourses || [];
  const submissions = dashboard?.recentSubmissions || [];
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);

  // Color-coded stats items with individual gradients for a real-world SaaS feel
  const stats = [
    {
      title: "Total Courses",
      value: statsData.totalCourses || 0,
      icon: BookOpen,
      path: "/instructor/courses",
      gradient: "from-blue-500 to-indigo-600",
      lightBg: "bg-blue-50/70",
      textColor: "text-blue-600",
      borderColor: "hover:border-blue-200",
    },
    {
      title: "Active Courses",
      value: statsData.activeCourses || 0,
      icon: CheckCircle2,
      path: "/instructor/courses",
      gradient: "from-emerald-500 to-teal-600",
      lightBg: "bg-emerald-50/70",
      textColor: "text-emerald-600",
      borderColor: "hover:border-emerald-200",
    },
    {
      title: "Active Students",
      value: statsData.totalStudents || 0,
      icon: Users,
      path: "/instructor/courses",
      gradient: "from-violet-500 to-purple-600",
      lightBg: "bg-violet-50/70",
      textColor: "text-violet-600",
      borderColor: "hover:border-violet-200",
    },
    {
      title: "My Total Earnings",
      value: formatCurrency(statsData.totalEarnings),
      icon: DollarSign,
      path: "/instructor/courses",
      gradient: "from-rose-500 to-orange-600",
      lightBg: "bg-rose-50/70",
      textColor: "text-rose-600",
      borderColor: "hover:border-rose-200",
    },
    {
      title: "Assignments",
      value: statsData.totalAssignments || 0,
      icon: ClipboardList,
      path: "/instructor/assignments",
      gradient: "from-amber-500 to-orange-600",
      lightBg: "bg-amber-50/70",
      textColor: "text-amber-600",
      borderColor: "hover:border-amber-200",
    },
    {
      title: "Resources",
      value: statsData.totalResources || 0,
      icon: FileText,
      path: "/instructor/resources",
      gradient: "from-pink-500 to-rose-600",
      lightBg: "bg-pink-50/70",
      textColor: "text-pink-600",
      borderColor: "hover:border-pink-200",
    },
    {
      title: "Certificates",
      value: statsData.totalCertificates || 0,
      icon: Award,
      path: "/instructor/certificates",
      gradient: "from-cyan-500 to-blue-600",
      lightBg: "bg-cyan-50/70",
      textColor: "text-cyan-600",
      borderColor: "hover:border-cyan-200",
    },
    {
      title: "Submissions",
      value: statsData.totalSubmissions || 0,
      icon: UploadCloud,
      path: "/instructor/assignments",
      gradient: "from-indigo-500 to-blue-700",
      lightBg: "bg-indigo-50/70",
      textColor: "text-indigo-600",
      borderColor: "hover:border-indigo-200",
    },
    {
      title: "Need Review",
      value: statsData.pendingSubmissions || 0,
      icon: Clock,
      path: "/instructor/assignments",
      gradient: "from-rose-500 to-red-600",
      lightBg: "bg-rose-50/70",
      textColor: "text-rose-600",
      borderColor: "hover:border-rose-200",
    },
  ];

  // Chart Data Preparation
  const instructorOverviewBarData = [
    { name: "Courses", count: statsData.totalCourses || 0 },
    { name: "Students", count: statsData.totalStudents || 0 },
    { name: "Assignments", count: statsData.totalAssignments || 0 },
    { name: "Resources", count: statsData.totalResources || 0 },
  ];

  const submissionStatusData = [
    {
      name: "Reviewed/Success",
      value:
        (statsData.totalSubmissions || 0) - (statsData.pendingSubmissions || 0),
    },
    { name: "Pending Review", value: statsData.pendingSubmissions || 0 },
  ];

  if (loading) {
    return (
      <div className="flex min-h-112.5 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={38} className="animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading instructor dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-purple-900 to-blue-900 p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-white/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 h-48 w-48 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-indigo-200 border border-white/15 mb-3 shadow-inner">
              <Sparkles size={13} className="text-amber-300 animate-pulse" />{" "}
              Instructor Portal
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-indigo-100 max-w-xl leading-relaxed font-normal">
              Here is an overview of your training modules, pending student
              submissions, and course analytics.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/instructor/courses/create")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs md:text-sm font-semibold text-indigo-900 shadow-xl transition-all hover:bg-indigo-50 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Plus size={16} /> Create New Course
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50/70 p-4 text-xs font-semibold text-red-600 flex items-center gap-2 shadow-xs">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* STATS GRID WITH COLORFUL ACCENT CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <motion.button
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              key={stat.title}
              type="button"
              onClick={() => navigate(stat.path)}
              className={`group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-xs transition-all hover:shadow-lg ${stat.borderColor}`}
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${stat.gradient} opacity-80 group-hover:opacity-100 transition`}
              />

              <div className="flex items-center justify-between">
                <div
                  className={`rounded-xl ${stat.lightBg} p-3 ${stat.textColor} transition group-hover:scale-110`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex items-center gap-1 text-slate-300 transition group-hover:text-indigo-600">
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {stat.title}
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-800">
                {stat.value}
              </h2>
            </motion.button>
          );
        })}
      </div>

      {/* ANALYTICS VISUALIZATION CHARTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Core Activity Bar Chart */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-xs flex flex-col justify-between"
        >
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-800 tracking-tight">
              Teaching Metrics Overview
            </h3>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Volume metrics across your modules and resources
            </p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={instructorOverviewBarData}
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

        {/* Student Submissions Donut Chart */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-xs flex flex-col justify-between"
        >
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-800 tracking-tight">
              Submission Status Breakdown
            </h3>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Ratio of pending vs processed student assignments
            </p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={submissionStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {submissionStatusData.map((entry, index) => (
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

      {/* QUICK ACTIONS & RECENT COURSES */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* QUICK ACTIONS */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800 tracking-tight">
              Quick Actions
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              Shortcuts
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <QuickAction
              icon={BookOpen}
              title="Create Course"
              description="Add a new training module"
              onClick={() => navigate("/instructor/courses/create")}
              colorClass="bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
            />
            <QuickAction
              icon={ClipboardList}
              title="Create Assignment"
              description="Assign tasks to students"
              onClick={() => navigate("/instructor/assignments/create")}
              colorClass="bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white"
            />
            <QuickAction
              icon={FileText}
              title="Manage Resources"
              description="Upload course materials"
              onClick={() => navigate("/instructor/resources")}
              colorClass="bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white"
            />
            <QuickAction
              icon={Award}
              title="Certificates"
              description="Issue student awards"
              onClick={() => navigate("/instructor/certificates")}
              colorClass="bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
            />
          </div>
        </div>

        {/* RECENT COURSES */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-slate-800 tracking-tight">
                My Recent Courses
              </h2>
              <button
                type="button"
                onClick={() => navigate("/instructor/courses")}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {courses.length === 0 ? (
                <EmptyCourses
                  onCreate={() => navigate("/instructor/courses/create")}
                />
              ) : (
                courses.slice(0, 4).map((course) => (
                  <div
                    key={course._id || course.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition hover:bg-indigo-50/30 hover:border-indigo-100"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="truncate text-xs md:text-sm font-semibold text-slate-800">
                        {course.title || "Untitled Course"}
                      </p>
                      <p className="text-[11px] font-normal text-slate-400 mt-0.5">
                        <span className="capitalize font-semibold text-indigo-600">
                          {course.status || "Active"}
                        </span>{" "}
                        ·{" "}
                        {Number(
                          course.totalStudents ||
                            course.enrolledStudents?.length ||
                            0,
                        )}{" "}
                        students
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/instructor/courses/${course._id || course.id}/edit`,
                        )
                      }
                      className="shrink-0 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-600 hover:text-white shadow-xs"
                    >
                      Manage
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RECENT SUBMISSIONS */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800 tracking-tight">
            Recent Student Submissions
          </h2>
          <button
            type="button"
            onClick={() => navigate("/instructor/assignments")}
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            View All Assignments
          </button>
        </div>

        <div className="space-y-3">
          {submissions.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center text-xs text-slate-500 font-normal">
              No student submissions yet.
            </div>
          ) : (
            submissions.slice(0, 5).map((submission) => (
              <div
                key={submission._id || submission.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between transition hover:bg-slate-50 hover:border-slate-200"
              >
                <div className="min-w-0 pr-2">
                  <p className="truncate text-xs md:text-sm font-semibold text-slate-800">
                    {submission.assignment?.title || "Assignment Submission"}
                  </p>
                  <p className="text-[11px] font-normal text-slate-400 mt-0.5">
                    <span className="font-semibold text-slate-700">
                      {submission.student?.fullName || "Student"}
                    </span>{" "}
                    · {submission.assignment?.course?.title || "Course"}
                  </p>
                </div>
                <span className="w-fit rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-700 shadow-xs">
                  {submission.status || "Submitted"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.main>
  );
};

const QuickAction = ({
  icon: Icon,
  title,
  description,
  onClick,
  colorClass,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-left transition-all hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-sm"
  >
    <div className={`rounded-xl p-3 shadow-xs transition ${colorClass}`}>
      <Icon size={20} />
    </div>
    <div className="min-w-0">
      <p className="text-xs md:text-sm font-semibold text-slate-800">{title}</p>
      <p className="text-[11px] text-slate-400 truncate mt-0.5 font-normal">
        {description}
      </p>
    </div>
  </button>
);

const EmptyCourses = ({ onCreate }) => (
  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center">
    <GraduationCap size={32} className="mx-auto text-slate-400 mb-2" />
    <p className="text-xs text-slate-500 font-normal">
      You have not created any courses yet.
    </p>
    <button
      type="button"
      onClick={onCreate}
      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
    >
      <Plus size={14} /> Create your first course
    </button>
  </div>
);

export default InstructorDashboard;
