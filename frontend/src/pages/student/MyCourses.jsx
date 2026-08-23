import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  BookOpen,
  Loader2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";

import { getMyEnrollments } from "../../api/enrollment.services";

const MyCourses = () => {
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
            Loading your courses...
          </p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (isError) {
    const errorMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load your courses";
    toast.error(errorMsg);

    return (
      <div className="flex min-h-112.5 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-red-50/70 p-8 text-center shadow-sm backdrop-blur-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-4">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-base font-bold text-red-800">
            Failed to Load Courses
          </h2>
          <p className="mt-1 text-xs text-red-600 leading-relaxed">
            {errorMsg}
          </p>
        </div>
      </div>
    );
  }

  const validEnrollments = Array.isArray(enrollments)
    ? enrollments.filter((item) => item?.course)
    : [];

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
              <Sparkles size={13} className="text-amber-300" /> Learning
              Workspace
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              My Courses
            </h1>
            <p className="mt-1.5 text-sm text-indigo-100 max-w-xl">
              View your enrolled courses, manage lesson progress, and seamlessly
              continue your academic tracks.
            </p>
          </div>
          <button
            onClick={() => navigate("/courses")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-5 py-3 text-xs md:text-sm font-black text-slate-900 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            Explore More <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {validEnrollments.length === 0 ? (
        <div className="flex min-h-87.5 items-center justify-center px-4 rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs mb-4">
              <BookOpen size={30} />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              No Courses Yet
            </h2>
            <p className="mt-1.5 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              You haven't enrolled in any courses. Browse our extensive catalog
              to get started.
            </p>
            <button
              type="button"
              onClick={() => navigate("/courses")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]"
            >
              Browse Courses <ArrowRight size={15} />
            </button>
          </div>
        </div>
      ) : (
        /* COURSE GRID */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {validEnrollments.map((enrollment, idx) => {
            const course = enrollment.course;
            const progress = Math.min(
              Math.max(Number(enrollment.progress || 0), 0),
              100,
            );
            const isCompleted =
              progress === 100 || enrollment.status === "Completed";
            const isCancelled = enrollment.status === "Cancelled";

            return (
              <motion.div
                key={enrollment._id || enrollment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div>
                  {/* COURSE IMAGE */}
                  <div className="relative flex h-44 items-center justify-center bg-slate-100 overflow-hidden">
                    {course.courseImage ? (
                      <img
                        src={course.courseImage}
                        alt={course.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <BookOpen size={28} />
                        <span className="text-xs font-medium">
                          No Preview Image
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={enrollment.status} />
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="space-y-4 p-5">
                    <h2 className="line-clamp-1 text-base font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition">
                      {course.title || "Untitled Course"}
                    </h2>

                    <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {course.description || "No description available."}
                    </p>

                    {/* PAYMENT STATUS */}
                    <div className="flex items-center justify-between rounded-xl bg-slate-50/70 p-3 border border-slate-100">
                      <span className="text-xs font-semibold text-slate-500">
                        Payment
                      </span>
                      <PaymentBadge status={enrollment.paymentStatus} />
                    </div>

                    {/* PROGRESS */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">
                          Progress
                        </span>
                        <span className="font-black text-indigo-600">
                          {progress}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-indigo-500 to-blue-600 transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* COMPLETED NOTICE */}
                    {enrollment.completedAt && (
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-50/80 p-3 text-xs font-semibold text-emerald-700 border border-emerald-100">
                        <CheckCircle2
                          size={16}
                          className="shrink-0 text-emerald-600"
                        />
                        <span>
                          Completed on{" "}
                          {new Date(
                            enrollment.completedAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    disabled={isCancelled}
                    onClick={() =>
                      navigate(`/student/courses/${course._id || course.id}`)
                    }
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition shadow-xs ${
                      isCancelled
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
                      <>Enrollment Cancelled</>
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
      )}
    </motion.main>
  );
};

// STATUS BADGE COMPONENT
const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-500/90 text-white backdrop-blur-md shadow-xs",
    Approved: "bg-emerald-500/90 text-white backdrop-blur-md shadow-xs",
    Active: "bg-emerald-500/90 text-white backdrop-blur-md shadow-xs",
    Completed: "bg-indigo-600/90 text-white backdrop-blur-md shadow-xs",
    Cancelled: "bg-rose-500/90 text-white backdrop-blur-md shadow-xs",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
        styles[status] || "bg-slate-800/80 text-white"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
};

// PAYMENT BADGE COMPONENT
const PaymentBadge = ({ status }) => {
  const styles = {
    Pending: "text-amber-600 bg-amber-50 border border-amber-200/60",
    Paid: "text-emerald-600 bg-emerald-50 border border-emerald-200/60",
    Failed: "text-rose-600 bg-rose-50 border border-rose-200/60",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
        styles[status] || "text-slate-600 bg-slate-100 border border-slate-200"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
};

export default MyCourses;
