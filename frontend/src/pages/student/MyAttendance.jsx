import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Loader2,
  AlertCircle,
  Sparkles,
  ChevronDown,
  BarChart3,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

import { getMyAttendance } from "../../api/attendance.services";
import { getMyEnrollments } from "../../api/enrollment.services";

const MyAttendance = () => {
  const [courseId, setCourseId] = useState("");

  const enrollmentsQuery = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: getMyEnrollments,
  });

  const attendanceQuery = useQuery({
    queryKey: ["student-attendance", courseId],
    queryFn: () => getMyAttendance(courseId ? { course: courseId } : {}),
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

  const attendances =
    attendanceQuery.data?.attendances ||
    attendanceQuery.data?.data?.attendances ||
    [];

  if (attendanceQuery.isLoading || enrollmentsQuery.isLoading) {
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

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-900 via-purple-900 to-blue-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-indigo-200 border border-white/15 mb-3">
              <Sparkles size={13} className="text-amber-300" /> Academic
              Participation
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              My Attendance 📅
            </h1>
            <p className="mt-1.5 text-sm text-indigo-100 max-w-xl">
              Track your day-to-day course presence records, arrival statuses,
              and review instructor remarks.
            </p>
          </div>
          <Link
            to="/student/attendance/percentage"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-5 py-3 text-xs md:text-sm font-black text-slate-900 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <BarChart3 size={16} /> Attendance Report
          </Link>
        </div>
      </div>

      {/* FILTER CARD */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 md:p-6 shadow-xs">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Filter by Course
        </label>
        <div className="relative md:max-w-md">
          <select
            value={courseId}
            onChange={(event) => setCourseId(event.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 pr-10 text-xs font-bold text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 cursor-pointer shadow-xs"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option
                key={course._id || course.id}
                value={course._id || course.id}
              >
                {course.title || "Untitled Course"}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
      </div>

      {/* ERROR STATE */}
      {attendanceQuery.isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50/70 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-4">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-base font-bold text-red-800">
            Failed to Load Attendance
          </h2>
          <p className="mt-1 text-xs text-red-600 leading-relaxed">
            {attendanceQuery.error?.response?.data?.message ||
              attendanceQuery.error?.message ||
              "Failed to load attendance records."}
          </p>
        </div>
      ) : attendances.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex min-h-87.5 items-center justify-center px-4 rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs mb-4">
              <CalendarCheck size={30} />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              No Attendance Records
            </h2>
            <p className="mt-1.5 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Attendance records logged by instructors for your enrolled courses
              will appear here.
            </p>
          </div>
        </div>
      ) : (
        /* TABLE CONTAINER */
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
              <thead className="bg-slate-50/70 font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendances.map((item) => (
                  <tr
                    key={item._id || item.id}
                    className="hover:bg-slate-50/50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-slate-600 whitespace-nowrap">
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {item.course?.title || "Course"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.remarks || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.main>
  );
};

// STATUS BADGE COMPONENT
const StatusBadge = ({ status }) => {
  const styles = {
    Present: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    Absent: "bg-rose-50 text-rose-700 border-rose-200/60",
    Late: "bg-amber-50 text-amber-700 border-amber-200/60",
  };

  const icons = {
    Present: <CheckCircle2 size={11} className="shrink-0" />,
    Absent: <XCircle size={11} className="shrink-0" />,
    Late: <Clock size={11} className="shrink-0" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
        styles[status] || "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      {icons[status]} {status || "N/A"}
    </span>
  );
};

export default MyAttendance;
