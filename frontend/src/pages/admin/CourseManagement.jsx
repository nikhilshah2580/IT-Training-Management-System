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
  Clock,
  LayoutGrid,
  List,
  AlertCircle,
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

  // Filters & State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState(null);

  const limit = 6;

  // GET COURSES
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [
      "courses",
      {
        search,
        category,
        skillLevel,
        status: status || (activeTab !== "All" ? activeTab : undefined),
        page,
        limit,
      },
    ],
    queryFn: () =>
      getAdminCourses({
        search: search || undefined,
        category: category || undefined,
        skillLevel: skillLevel || undefined,
        status: status || (activeTab !== "All" ? activeTab : undefined),
        page,
        limit,
      }),
    keepPreviousData: true,
  });

  const courses = data?.courses || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const totalCourses = data?.pagination?.totalCourses || courses.length;

  // Calculate dynamic stats from API metadata or response
  const stats = {
    active:
      data?.stats?.active ||
      courses.filter((c) => c.status === "Active").length,
    pending:
      data?.stats?.pending ||
      courses.filter((c) => c.status === "Pending").length,
    draft:
      data?.stats?.draft ||
      courses.filter((c) => c.status === "Inactive" || c.status === "Draft")
        .length,
    free:
      data?.stats?.free || courses.filter((c) => Number(c.fee) === 0).length,
    paid: data?.stats?.paid || courses.filter((c) => Number(c.fee) > 0).length,
  };

  // MUTATIONS
  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: (response) => {
      toast.success(response?.message || "Course deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Failed to delete course"));
    },
  });

  const approveMutation = useMutation({
    mutationFn: approveCourse,
    onSuccess: (response) => {
      toast.success(response?.message || "Course approved successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Failed to approve course"));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectCourse,
    onSuccess: (response) => {
      toast.success(response?.message || "Course rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Failed to reject course"));
    },
  });

  // HANDLERS
  const handleTabChange = (tabLabel) => {
    setActiveTab(tabLabel);
    setStatus(tabLabel === "All" ? "" : tabLabel);
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setSkillLevel("");
    setStatus("");
    setActiveTab("All");
    setPage(1);
  };

  const handleApprove = (course) => {
    setConfirmAction({
      title: "Approve Course",
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
      title: "Reject Course",
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
      title: "Delete Course",
      message: `Delete "${course.title}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      tone: "destructive",
      onConfirm: () =>
        deleteMutation.mutate(course._id, {
          onSuccess: () => setConfirmAction(null),
        }),
    });
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-800">
      {/* 1. TOP HEADER & REFRESH */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Course Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage, filter, and approve active and pending courses.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl bg-emerald-500 p-4 text-white shadow-xs">
          <p className="text-xs font-semibold opacity-90">Active Courses</p>
          <p className="mt-1 text-2xl font-black">{stats.active}</p>
        </div>
        <div className="rounded-xl bg-rose-500 p-4 text-white shadow-xs">
          <p className="text-xs font-semibold opacity-90">Pending Courses</p>
          <p className="mt-1 text-2xl font-black">{stats.pending}</p>
        </div>
        <div className="rounded-xl bg-indigo-600 p-4 text-white shadow-xs">
          <p className="text-xs font-semibold opacity-90">Draft / Inactive</p>
          <p className="mt-1 text-2xl font-black">{stats.draft}</p>
        </div>
        <div className="rounded-xl bg-sky-400 p-4 text-white shadow-xs">
          <p className="text-xs font-semibold opacity-90">Free Courses</p>
          <p className="mt-1 text-2xl font-black">{stats.free}</p>
        </div>
        <div className="col-span-2 rounded-xl bg-purple-600 p-4 text-white shadow-xs sm:col-span-1">
          <p className="text-xs font-semibold opacity-90">Paid Courses</p>
          <p className="mt-1 text-2xl font-black">{stats.paid}</p>
        </div>
      </div>

      {/* 3. DYNAMIC FILTERS TOOLBAR */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search Input */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search course title..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs outline-none focus:border-rose-500 focus:bg-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-rose-500"
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

          {/* Level Filter */}
          <select
            value={skillLevel}
            onChange={(e) => {
              setSkillLevel(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-rose-500"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Status Select Filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setActiveTab(e.target.value || "All");
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-rose-500"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {(search ||
          category ||
          skillLevel ||
          status ||
          activeTab !== "All") && (
          <button
            onClick={handleReset}
            className="text-xs font-bold text-rose-500 hover:underline"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* 4. SECTION HEADER, TAB PILLS & VIEW TOGGLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Courses</h3>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-2 transition ${
                viewMode === "list"
                  ? "bg-rose-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              title="List View"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-2 transition ${
                viewMode === "grid"
                  ? "bg-rose-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          {[
            { label: "All", value: "" },
            { label: "Active", value: "Active" },
            { label: "Pending", value: "Pending" },
            { label: "Inactive", value: "Inactive" },
            { label: "Rejected", value: "Rejected" },
          ].map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => handleTabChange(tab.label)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  isActive
                    ? "bg-rose-500 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. COURSES DISPLAY */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-100 bg-white p-8 text-center">
          <AlertCircle className="mx-auto mb-2 text-rose-500" size={32} />
          <p className="text-sm font-semibold text-rose-600">
            Failed to load courses
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {error?.response?.data?.message ||
              error?.message ||
              "An error occurred"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-xs font-bold text-white"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 py-16 text-center text-slate-400">
          <BookOpen className="mx-auto mb-2 opacity-40" size={36} />
          <p className="text-sm font-semibold">
            No courses found matching criteria.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW (FIGMA UI DESIGN) */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {courses.map((course, idx) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs transition hover:shadow-md"
              >
                {/* Thumbnail Image */}
                <div className="relative h-44 w-full bg-slate-100">
                  {course.courseImage ? (
                    <img
                      src={course.courseImage}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600 font-black text-white">
                      COURSE
                    </div>
                  )}

                  {/* Price Tag Badge */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-xs">
                    {Number(course.fee) === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      <>
                        <span className="text-rose-500">${course.fee}</span>
                        {course.oldFee && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ${course.oldFee}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h4 className="line-clamp-2 text-sm font-bold text-slate-900 transition group-hover:text-rose-500">
                      {course.title}
                    </h4>

                    {/* Metadata */}
                    <div className="mt-3 flex items-center gap-4 text-[11px] font-medium text-rose-500">
                      <div className="flex items-center gap-1">
                        <BookOpen size={13} />
                        <span>{course.totalLessons || "12+"} Lesson</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock size={13} />
                        <span>{course.duration || "9hr 30min"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
                    <button
                      onClick={() => handleDelete(course)}
                      className="flex items-center gap-1 hover:text-rose-500"
                    >
                      <Trash2 size={13} /> Delete
                    </button>

                    <div className="flex items-center gap-3">
                      {course.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(course)}
                            className="flex items-center gap-1 text-emerald-600 hover:underline"
                          >
                            <Check size={13} /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(course)}
                            className="flex items-center gap-1 text-rose-500 hover:underline"
                          >
                            <X size={13} /> Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() =>
                          navigate(`/admin/courses/${course._id}/edit`)
                        }
                        className="flex items-center gap-1 hover:text-indigo-600"
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={() => navigate(`/admin/courses/${course._id}`)}
                        className="flex items-center gap-1 hover:text-indigo-600"
                      >
                        <Eye size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* LIST / TABLE VIEW */
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-400 font-bold uppercase">
                  <th className="p-4">Course</th>
                  <th className="p-4">Instructor</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">
                      {course.title}
                    </td>
                    <td className="p-4 text-slate-600">
                      {course.instructor?.fullName || "Unknown"}
                    </td>
                    <td className="p-4 text-slate-600">{course.category}</td>
                    <td className="p-4 font-bold text-slate-900">
                      ${Number(course.fee || 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                        {course.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/courses/${course._id}`)
                          }
                          className="text-slate-400 hover:text-indigo-600"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/courses/${course._id}/edit`)
                          }
                          className="text-slate-400 hover:text-indigo-600"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(course)}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-slate-400">
            Page <strong className="text-slate-700">{page}</strong> of{" "}
            <strong className="text-slate-700">{totalPages}</strong> (
            {totalCourses} records)
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-full text-xs font-bold transition ${
                  page === p
                    ? "bg-rose-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
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
    </div>
  );
};

export default CourseManagement;
