import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  CreditCard,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  PlayCircle,
  ShieldAlert,
} from "lucide-react";

import { getMyEnrollments } from "../../api/enrollment.services";

const MyEnrollments = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: getMyEnrollments,
  });

  const enrollments =
    data?.enrollments || data?.data?.enrollments || data?.data || [];

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex min-h-112.5 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={38} className="animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading your academic enrollments...
          </p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (isError) {
    return (
      <div className="flex min-h-112.5 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-red-50/70 p-8 text-center shadow-sm backdrop-blur-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-4">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-base font-bold text-red-800">
            Failed to Load Enrollments
          </h2>
          <p className="mt-1 text-xs text-red-600 leading-relaxed">
            {error?.response?.data?.message ||
              error?.message ||
              "Something went wrong while connecting to the server."}
          </p>
        </div>
      </div>
    );
  }

  // EMPTY STATE
  if (!Array.isArray(enrollments) || enrollments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex min-h-125 items-center justify-center px-4"
      >
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs mb-4">
            <BookOpen size={30} />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            No Active Enrollments Found
          </h2>
          <p className="mt-1.5 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            You haven’t enrolled in any courses yet. Explore our expansive
            catalog to kickstart your professional journey.
          </p>
          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]"
          >
            Explore Course Catalog <ArrowRight size={15} />
          </button>
        </div>
      </motion.div>
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
              Dashboard
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              My Course Enrollments
            </h1>
            <p className="mt-1.5 text-sm text-indigo-100 max-w-xl">
              Track your learning trajectories, review module progression, and
              pick up right where you left off.
            </p>
          </div>
          <button
            onClick={() => navigate("/courses")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-5 py-3 text-xs md:text-sm font-black text-slate-900 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            Browse More Courses <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ENROLLMENT CARDS GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {enrollments.map((enrollment, idx) => {
          const course = enrollment.course || {};
          const progress = Math.min(
            Math.max(Number(enrollment.progress || 0), 0),
            100,
          );
          const isCompleted =
            progress === 100 || enrollment.status === "Completed";
          const isCancelled = enrollment.status === "Cancelled";
          const isPending = enrollment.status === "Pending";

          return (
            <motion.div
              key={enrollment._id || enrollment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5"
            >
              <div>
                {/* COURSE HEADER */}
                <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-blue-900 p-5 text-white">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="rounded-xl bg-white/10 backdrop-blur-md p-2.5 border border-white/15">
                      <BookOpen size={20} className="text-indigo-200" />
                    </div>
                    <StatusBadge status={enrollment.status} />
                  </div>

                  <h2 className="line-clamp-1 text-base font-bold tracking-tight">
                    {course?.title || "Untitled Course"}
                  </h2>
                </div>

                {/* CONTENT BODY */}
                <div className="space-y-4 p-5">
                  <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {course?.description ||
                      "No course syllabus summary provided."}
                  </p>

                  {/* COURSE INFO METRICS */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <InfoItem
                      icon={<Clock size={15} className="text-indigo-600" />}
                      label="Duration"
                      value={course?.duration || "Self-paced"}
                    />
                    <InfoItem
                      icon={
                        <CreditCard size={15} className="text-emerald-600" />
                      }
                      label="Fee"
                      value={`Rs. ${course?.fee ?? 0}`}
                    />
                  </div>

                  {/* PAYMENT BADGE ROW */}
                  <div className="flex items-center justify-between rounded-xl bg-slate-50/70 p-3 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500">
                      Payment Status
                    </span>
                    <PaymentBadge status={enrollment.paymentStatus} />
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">
                        Completion
                      </span>
                      <span className="font-black text-indigo-600">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-indigo-500 to-blue-600 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* COMPLETED BANNER */}
                  {enrollment.completedAt && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50/80 p-3 text-xs font-semibold text-emerald-700 border border-emerald-100">
                      <CheckCircle2
                        size={16}
                        className="shrink-0 text-emerald-600"
                      />
                      <span>
                        Completed on{" "}
                        {new Date(enrollment.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  disabled={isCancelled || isPending}
                  onClick={() => {
                    const courseId = course?._id || course?.id;
                    if (courseId) {
                      navigate(`/student/courses/${courseId}`);
                    } else {
                      navigate("/student/my-courses");
                    }
                  }}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition shadow-xs ${
                    isCancelled || isPending
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      : isCompleted
                        ? "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20"
                  }`}
                >
                  {isCompleted ? (
                    <>
                      Review Course Content <ArrowRight size={14} />
                    </>
                  ) : isCancelled ? (
                    <>
                      Enrollment Cancelled <ShieldAlert size={14} />
                    </>
                  ) : isPending ? (
                    <>Approval Pending...</>
                  ) : (
                    <>
                      Continue Learning <PlayCircle size={14} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.main>
  );
};

// STATUS BADGE COMPONENT
const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-400/20 text-amber-200 border border-amber-400/30",
    Approved: "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30",
    Active: "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30",
    Completed: "bg-white/20 text-white border border-white/25",
    Cancelled: "bg-rose-400/20 text-rose-200 border border-rose-400/30",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md ${
        styles[status] || "bg-white/20 text-white"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
};

// PAYMENT BADGE COMPONENT
const PaymentBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-50 text-amber-700 border border-amber-200/60",
    Paid: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    Failed: "bg-rose-50 text-rose-700 border border-rose-200/60",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
        styles[status] || "bg-slate-100 text-slate-600 border border-slate-200"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
};

// INFO ITEM COMPONENT
const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="rounded-xl bg-slate-50/70 p-3 border border-slate-100">
      <div className="mb-1 flex items-center gap-1.5 text-slate-400">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="truncate text-xs font-bold text-slate-800">{value}</p>
    </div>
  );
};

export default MyEnrollments;
