import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Loader2,
  CalendarCheck,
  Sparkles,
  AlertCircle,
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
  BookOpen,
} from "lucide-react";

import { getAttendancePercentage } from "../../api/attendance.services";
import { getMyEnrollments } from "../../api/enrollment.services";

const AttendancePercentage = () => {
  const enrollmentsQuery = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: getMyEnrollments,
  });

  const courses = useMemo(
    () =>
      (
        enrollmentsQuery.data?.enrollments ||
        enrollmentsQuery.data?.data?.enrollments ||
        enrollmentsQuery.data?.data ||
        []
      )
        .map((item) => item.course)
        .filter(Boolean),
    [enrollmentsQuery.data],
  );

  const [courseId, setCourseId] = useState("");
  const selectedCourse = courseId || courses[0]?._id || courses[0]?.id || "";

  const reportQuery = useQuery({
    queryKey: ["student-attendance-percentage", selectedCourse],
    queryFn: () => getAttendancePercentage({ course: selectedCourse }),
    enabled: Boolean(selectedCourse),
  });

  if (enrollmentsQuery.isLoading) {
    return (
      <div className="flex min-h-112.5 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={38} className="animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading attendance records...
          </p>
        </div>
      </div>
    );
  }

  const report =
    reportQuery.data?.attendance ||
    reportQuery.data?.data?.attendance ||
    reportQuery.data;

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-4xl space-y-8 pb-12"
    >
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-900 via-purple-900 to-blue-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-indigo-200 border border-white/15 mb-3">
              <Sparkles size={13} className="text-amber-300" /> Academic Metrics
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Attendance Report
            </h1>
            <p className="mt-1.5 text-sm text-indigo-100 max-w-xl">
              Select your enrolled course to analyze your class presence,
              attendance percentage, and participation metrics.
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT CARD */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select Enrolled Course
          </label>
          <div className="relative">
            <select
              value={selectedCourse}
              onChange={(event) => setCourseId(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 pr-10 text-xs font-bold text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 cursor-pointer shadow-xs"
            >
              {courses.length === 0 ? (
                <option value="">No enrolled courses available</option>
              ) : (
                courses.map((course) => (
                  <option
                    key={course._id || course.id}
                    value={course._id || course.id}
                  >
                    {course.title || "Untitled Course"}
                  </option>
                ))
              )}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        {reportQuery.isLoading ? (
          <div className="flex min-h-55 items-center justify-center">
            <Loader2 size={32} className="animate-spin text-indigo-600" />
          </div>
        ) : reportQuery.isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50/70 p-6 text-center shadow-sm">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-3">
              <AlertCircle size={20} />
            </div>
            <h2 className="text-sm font-bold text-red-800">
              Failed to load attendance report
            </h2>
            <p className="mt-1 text-xs text-red-600">
              {reportQuery.error?.response?.data?.message ||
                reportQuery.error?.message ||
                "Please try again later."}
            </p>
          </div>
        ) : report ? (
          <div className="pt-2">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Metric
                label="Percentage"
                value={`${report.percentage ?? 0}%`}
                highlight
                icon={<CalendarCheck size={18} />}
              />
              <Metric
                label="Classes"
                value={report.totalClasses ?? 0}
                icon={<BookOpen size={18} />}
              />
              <Metric
                label="Present"
                value={report.present ?? 0}
                icon={<CheckCircle2 size={18} className="text-emerald-500" />}
              />
              <Metric
                label="Late"
                value={report.late ?? 0}
                icon={<Clock size={18} className="text-amber-500" />}
              />
              <Metric
                label="Absent"
                value={report.absent ?? 0}
                icon={<XCircle size={18} className="text-rose-500" />}
              />
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">
            No attendance data available for the selected course.
          </div>
        )}
      </section>
    </motion.main>
  );
};

const Metric = ({ label, value, highlight = false, icon }) => (
  <div
    className={`flex flex-col justify-between rounded-2xl p-5 border transition-all ${
      highlight
        ? "bg-linear-to-br from-indigo-600 to-blue-700 text-white border-transparent shadow-lg shadow-indigo-500/20"
        : "bg-slate-50/70 text-slate-800 border-slate-100 shadow-xs hover:bg-slate-50"
    }`}
  >
    <div className="flex items-center justify-between text-xs font-semibold mb-3">
      <span className={highlight ? "text-indigo-100" : "text-slate-500"}>
        {label}
      </span>
      {icon && (
        <span className={highlight ? "text-indigo-200" : "text-slate-400"}>
          {icon}
        </span>
      )}
    </div>
    <p
      className={`text-2xl md:text-3xl font-black tracking-tight ${highlight ? "text-white" : "text-slate-800"}`}
    >
      {value}
    </p>
  </div>
);

export default AttendancePercentage;
