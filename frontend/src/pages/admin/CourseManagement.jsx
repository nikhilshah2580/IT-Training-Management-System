import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { getErrorMessage } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

import {
  getAdminCourses,
  deleteCourse,
  approveCourse,
  rejectCourse,
} from "../../api/course.services";

const CourseManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState(null);

  const limit = 10;

  // GET COURSES
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [
      "courses",
      {
        search,
        category,
        skillLevel,
        status,
        page,
        limit,
      },
    ],
    queryFn: () =>
      getAdminCourses({
        search: search || undefined,
        category: category || undefined,
        skillLevel: skillLevel || undefined,
        status: status || undefined,
        page,
        limit,
      }),
    keepPreviousData: true,
  });

  const courses = data?.courses || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const totalCourses = data?.pagination?.totalCourses || courses.length;

  // DELETE COURSE
  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: (response) => {
      toast.success(response?.message || "Course deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete course"));
    },
  });

  // APPROVE COURSE
  const approveMutation = useMutation({
    mutationFn: approveCourse,
    onSuccess: (response) => {
      toast.success(response?.message || "Course approved successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to approve course"));
    },
  });

  // REJECT COURSE
  const rejectMutation = useMutation({
    mutationFn: rejectCourse,
    onSuccess: (response) => {
      toast.success(response?.message || "Course rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to reject course"));
    },
  });

  // HANDLERS
  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleSkillLevelChange = (event) => {
    setSkillLevel(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handleApprove = (course) => {
    setConfirmAction({
      title: "Approve course",
      message: `Approve "${course.title}"?`,
      confirmLabel: "Approve",
      tone: "primary",
      onConfirm: () =>
        approveMutation.mutate(course._id, {
          onSuccess: () => setConfirmAction(null),
        }),
    });
  };

  const handleReject = (course) => {
    setConfirmAction({
      title: "Reject course",
      message: `Reject "${course.title}"?`,
      confirmLabel: "Reject",
      tone: "destructive",
      onConfirm: () =>
        rejectMutation.mutate(course._id, {
          onSuccess: () => setConfirmAction(null),
        }),
    });
  };

  const handleDelete = (course) => {
    setConfirmAction({
      title: "Delete course",
      message: `Delete "${course.title}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      tone: "destructive",
      onConfirm: () =>
        deleteMutation.mutate(course._id, {
          onSuccess: () => setConfirmAction(null),
        }),
    });
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setSkillLevel("");
    setStatus("");
    setPage(1);
  };

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center bg-gray-50 rounded-2xl">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">
            Loading course library...
          </p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
        <p className="font-bold text-gray-900 text-lg">
          Failed to load courses
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong"}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
        >
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12"
    >
      {/* HEADER BANNER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Course Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage, approve, reject, and monitor course listings across your
            platform.
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-50 transition"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh Directory
        </motion.button>
      </div>

      {/* ADVANCED FILTER TOOLBAR */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm space-y-3">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {/* Search Bar */}
          <div className="relative lg:col-span-2">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search courses by title..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={handleCategoryChange}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          >
            <option value="">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science & Analytics">
              Data Science & Analytics
            </option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Networking">Networking</option>
            <option value="Cyber Security">Cyber Security</option>
            <option value="Database">Database</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="Other">Other</option>
          </select>

          {/* Skill Level Filter */}
          <select
            value={skillLevel}
            onChange={handleSkillLevelChange}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={handleStatusChange}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {(search || category || skillLevel || status) && (
          <div className="pt-1">
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* MODERN STYLED TABLE CONTAINER */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/75 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Instructor</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Fee</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 text-sm">
              {courses.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-16 text-center text-gray-400"
                  >
                    <BookOpen
                      size={40}
                      className="mx-auto mb-3 opacity-30 text-gray-600"
                    />
                    <p className="font-semibold text-gray-600">
                      No courses match your criteria.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try tweaking your filters or search options.
                    </p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {courses.map((course, idx) => (
                    <motion.tr
                      key={course._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: idx * 0.02 }}
                      className="group hover:bg-gray-50/80 transition-colors"
                    >
                      {/* Course Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200/60 shadow-xs">
                            {course.courseImage ? (
                              <img
                                src={course.courseImage}
                                alt={course.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-gray-400">
                                IMG
                              </div>
                            )}
                          </div>
                          <div className="max-w-60">
                            <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                              {course.title}
                            </p>
                            <p className="text-xs text-gray-400 font-medium">
                              {course.skillLevel}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Instructor */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {course.instructor?.fullName || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {course.instructor?.email || ""}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {course.category}
                      </td>

                      {/* Fee */}
                      <td className="px-6 py-4 font-bold text-gray-900">
                        Rs. {Number(course.fee || 0).toLocaleString()}
                      </td>

                      {/* Students Count */}
                      <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                        {course.totalStudents || 0}
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                            course.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : course.status === "Pending"
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : course.status === "Rejected"
                                  ? "bg-red-50 text-red-700 border border-red-100"
                                  : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {course.status === "Active" && (
                            <CheckCircle2 size={12} />
                          )}
                          {course.status === "Pending" && (
                            <AlertCircle size={12} />
                          )}
                          {course.status === "Rejected" && (
                            <XCircle size={12} />
                          )}
                          {course.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              navigate(`/admin/courses/${course._id}`)
                            }
                            className="rounded-xl p-2.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            title="View Course"
                          >
                            <Eye size={17} />
                          </motion.button>

                          {/* Edit */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              navigate(`/admin/courses/${course._id}/edit`)
                            }
                            className="rounded-xl p-2.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                            title="Edit Course"
                          >
                            <Pencil size={17} />
                          </motion.button>

                          {/* Approve */}
                          {course.status === "Pending" && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleApprove(course)}
                              disabled={
                                approveMutation.isPending ||
                                rejectMutation.isPending
                              }
                              className="rounded-xl p-2.5 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-30 transition-colors"
                              title="Approve Course"
                            >
                              <Check size={17} />
                            </motion.button>
                          )}

                          {/* Reject */}
                          {course.status === "Pending" && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleReject(course)}
                              disabled={
                                approveMutation.isPending ||
                                rejectMutation.isPending
                              }
                              className="rounded-xl p-2.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 transition-colors"
                              title="Reject Course"
                            >
                              <X size={17} />
                            </motion.button>
                          )}

                          {/* Delete */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(course)}
                            disabled={deleteMutation.isPending}
                            className="rounded-xl p-2.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 transition-colors"
                            title="Delete Course"
                          >
                            <Trash2 size={17} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info count */}
        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 text-xs font-semibold text-gray-500 flex items-center justify-between">
          <span>
            Displaying page <strong className="text-gray-900">{page}</strong> of{" "}
            <strong className="text-gray-900">{totalPages}</strong> (
            {totalCourses} total records)
          </span>
          <span className="text-gray-400 font-normal">
            Real-time synchronized
          </span>
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">
            Page <span className="font-bold text-gray-900">{page}</span> of{" "}
            <span className="font-bold text-gray-900">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 shadow-xs hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition"
            >
              <ChevronLeft size={18} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 shadow-xs hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG */}
      <ConfirmDialog
        open={Boolean(confirmAction)}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmLabel={confirmAction?.confirmLabel}
        tone={confirmAction?.tone}
        loading={
          deleteMutation.isPending ||
          approveMutation.isPending ||
          rejectMutation.isPending
        }
        onConfirm={confirmAction?.onConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </motion.div>
  );
};

export default CourseManagement;
