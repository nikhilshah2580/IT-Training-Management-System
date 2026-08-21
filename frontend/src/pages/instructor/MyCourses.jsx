import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Users,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Tag,
  DollarSign,
} from "lucide-react";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { getErrorMessage } from "../../utils/toast";

import { deleteCourse, getMyCourses } from "../../api/course.services";

const MyCourses = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["instructor-courses", { page }],
    queryFn: () => getMyCourses({ page, limit: 12 }),
  });

  const courses = data?.courses || data?.data?.courses || data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: (response) => {
      toast.success(response?.message || "Course deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      queryClient.invalidateQueries({ queryKey: ["instructor-dashboard"] });
      setDeleteTarget(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete course"));
    },
  });

  const handleDelete = (course) => {
    setDeleteTarget(course);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-112.5 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading your courses...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50/70 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-4">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-base font-bold text-red-800">
          Failed to load your courses
        </h2>
        <p className="mt-1 text-xs text-red-600 leading-relaxed max-w-sm mx-auto">
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong while retrieving your courses."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02]"
        >
          <RefreshCw size={15} /> Try Again
        </button>
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
              <Sparkles size={13} className="text-amber-300" /> Course
              Management
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              My Courses
            </h1>
            <p className="mt-1.5 text-sm text-indigo-100 max-w-xl">
              Manage the training courses you have created and track their
              approval and publication status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={isFetching ? "animate-spin" : ""}
              />{" "}
              Refresh
            </button>
            <button
              type="button"
              onClick={() => navigate("/instructor/courses/create")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs md:text-sm font-bold text-indigo-900 shadow-lg transition-all hover:bg-indigo-50 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={16} /> Create Course
            </button>
          </div>
        </div>
      </div>

      {/* COURSES LIST / GRID */}
      {courses.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-xs">
            <BookOpen size={28} />
          </div>
          <h2 className="text-base font-bold text-slate-800">
            No courses created yet
          </h2>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Create your first training course and submit it for platform
            approval to start onboarding students.
          </p>
          <button
            type="button"
            onClick={() => navigate("/instructor/courses/create")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-3 text-xs md:text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus size={16} /> Create Course
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <motion.article
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              key={course._id || course.id}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs transition hover:border-indigo-100 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative flex h-48 items-center justify-center bg-slate-100 overflow-hidden">
                  {course.courseImage ? (
                    <img
                      src={course.courseImage}
                      alt={course.title}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-slate-400">
                      <BookOpen size={24} />
                      <span className="text-xs font-semibold">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge status={course.status || "Inactive"} />
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h2 className="truncate text-sm md:text-base font-bold text-slate-800">
                      {course.title || "Untitled Course"}
                    </h2>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <Tag size={12} className="text-indigo-500" />{" "}
                      {course.category || "Uncategorized"} ·{" "}
                      {course.skillLevel || "All Levels"}
                    </p>
                  </div>

                  <p className="line-clamp-2 text-xs leading-relaxed text-slate-600 min-h-8">
                    {course.description ||
                      "No description available for this course."}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                      <p className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <DollarSign size={12} className="text-indigo-500" /> Fee
                      </p>
                      <p className="mt-0.5 text-xs md:text-sm font-bold text-slate-800">
                        Rs. {Number(course.fee || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                      <p className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <Users size={12} className="text-indigo-500" /> Students
                      </p>
                      <p className="mt-0.5 text-xs md:text-sm font-bold text-slate-800">
                        {course.totalStudents ||
                          course.enrolledStudents?.length ||
                          0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/instructor/courses/${course._id || course.id}/edit`,
                    )
                  }
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:scale-[1.02]"
                >
                  <Pencil size={14} /> Edit Course
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(course)}
                  disabled={deleteMutation.isPending}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition disabled:opacity-50"
                  title="Delete Course"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Course"
        message={`Are you sure you want to delete "${deleteTarget?.title || "this course"}"? This action cannot be undone.`}
        confirmText="Delete Course"
        isLoading={deleteMutation.isPending}
        onConfirm={() =>
          deleteTarget &&
          deleteMutation.mutate(deleteTarget._id || deleteTarget.id)
        }
        onClose={() => setDeleteTarget(null)}
      />
    </motion.main>
  );
};

// STATUS BADGE COMPONENT
const Badge = ({ status }) => {
  const normalizedStatus = (status || "Inactive").toLowerCase();

  const styles = {
    active:
      "bg-emerald-50 text-emerald-700 border-emerald-200/60 shadow-xs backdrop-blur-md",
    pending:
      "bg-amber-50 text-amber-700 border-amber-200/60 shadow-xs backdrop-blur-md",
    rejected:
      "bg-rose-50 text-rose-700 border-rose-200/60 shadow-xs backdrop-blur-md",
    inactive:
      "bg-slate-100 text-slate-600 border-slate-200 shadow-xs backdrop-blur-md",
  };

  const icons = {
    active: <CheckCircle2 size={11} className="shrink-0" />,
    pending: <Clock size={11} className="shrink-0" />,
    rejected: <XCircle size={11} className="shrink-0" />,
    inactive: <AlertCircle size={11} className="shrink-0" />,
  };

  const matchedStyle = styles[normalizedStatus] || styles.inactive;
  const matchedIcon = icons[normalizedStatus] || icons.inactive;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold border uppercase tracking-wider ${matchedStyle}`}
    >
      {matchedIcon} {status || "Inactive"}
    </span>
  );
};

export default MyCourses;
