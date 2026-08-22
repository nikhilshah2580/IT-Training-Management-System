import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEnrollments,
  updateEnrollmentStatus,
  cancelEnrollment,
} from "../../api/enrollment.services";
import { toast } from "react-toastify";
import {
  CheckCircle,
  XCircle,
  Ban,
  Loader2,
  GraduationCap,
  RefreshCw,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const PaymentStatusBadge = ({ status = "Pending" }) => {
  const styles = {
    Paid: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    Failed: "bg-red-50 text-red-700 border border-red-100",
    Pending: "bg-amber-50 text-amber-700 border border-amber-100",
  };

  const icons = {
    Paid: <CheckCircle size={12} />,
    Failed: <XCircle size={12} />,
    Pending: <Loader2 size={12} className="animate-spin" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] || styles.Pending
      }`}
    >
      {icons[status] || icons.Pending}
      {status}
    </span>
  );
};

const EnrollmentManagement = () => {
  const queryClient = useQueryClient();

  // Filters & State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'grid'
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState(null);

  const limit = 10;

  // GET ENROLLMENTS
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [
      "admin-enrollments",
      {
        search,
        status: statusFilter || (activeTab !== "All" ? activeTab : undefined),
        paymentStatus: paymentFilter || undefined,
        page,
        limit,
      },
    ],
    queryFn: () =>
      getEnrollments({
        search: search || undefined,
        status: statusFilter || (activeTab !== "All" ? activeTab : undefined),
        paymentStatus: paymentFilter || undefined,
        page,
        limit,
      }),
    keepPreviousData: true,
  });

  const enrollments = data?.enrollments || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const totalEnrollments =
    data?.pagination?.totalEnrollments || enrollments.length;

  // Calculate dynamic stats
  const stats = {
    total: totalEnrollments,
    active:
      data?.stats?.active ||
      enrollments.filter((e) => e.status === "Active").length,
    pending:
      data?.stats?.pending ||
      enrollments.filter((e) => e.status === "Pending").length,
    completed:
      data?.stats?.completed ||
      enrollments.filter((e) => e.status === "Completed").length,
    paid:
      data?.stats?.paid ||
      enrollments.filter((e) => e.paymentStatus === "Paid").length,
  };

  // MUTATIONS
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateEnrollmentStatus(id, status),
    onSuccess: (res) => {
      toast.success(res?.message || "Enrollment status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to update enrollment",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelEnrollment,
    onSuccess: (res) => {
      toast.success(res?.message || "Enrollment cancelled");
      queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to cancel enrollment",
      );
    },
  });

  // HANDLERS
  const handleTabChange = (tabLabel) => {
    setActiveTab(tabLabel);
    setStatusFilter(tabLabel === "All" ? "" : tabLabel);
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    setPaymentFilter("");
    setActiveTab("All");
    setPage(1);
  };

  const handleApprove = (enrollment) => {
    setConfirmAction({
      title: "Approve Enrollment",
      message: `Approve enrollment for ${enrollment.student?.fullName || "student"}?`,
      confirmLabel: "Approve",
      tone: "primary",
      onConfirm: () =>
        statusMutation.mutate(
          { id: enrollment._id, status: "Approved" },
          { onSuccess: () => setConfirmAction(null) },
        ),
    });
  };

  const handleCancel = (enrollment) => {
    setConfirmAction({
      title: "Cancel Enrollment",
      message: `Cancel enrollment for ${enrollment.student?.fullName || "student"}? This action cannot be undone.`,
      confirmLabel: "Cancel Enrollment",
      tone: "destructive",
      onConfirm: () =>
        cancelMutation.mutate(enrollment._id, {
          onSuccess: () => setConfirmAction(null),
        }),
    });
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-800">
      {/* 1. TOP HEADER & REFRESH */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Enrollment Management
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Monitor student course enrollments, track academic progress, and
            manage payment records.
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
        <div className="rounded-xl bg-indigo-600 p-4 text-white shadow-xs">
          <p className="text-xs font-semibold opacity-90">Total Registrations</p>
          <p className="mt-1 text-2xl font-black">{stats.total}</p>
        </div>
        <div className="rounded-xl bg-emerald-500 p-4 text-white shadow-xs">
          <p className="text-xs font-semibold opacity-90">Active Students</p>
          <p className="mt-1 text-2xl font-black">{stats.active}</p>
        </div>
        <div className="rounded-xl bg-rose-500 p-4 text-white shadow-xs">
          <p className="text-xs font-semibold opacity-90">Pending Approval</p>
          <p className="mt-1 text-2xl font-black">{stats.pending}</p>
        </div>
        <div className="rounded-xl bg-sky-400 p-4 text-white shadow-xs">
          <p className="text-xs font-semibold opacity-90">Completed Courses</p>
          <p className="mt-1 text-2xl font-black">{stats.completed}</p>
        </div>
        <div className="col-span-2 rounded-xl bg-purple-600 p-4 text-white shadow-xs sm:col-span-1">
          <p className="text-xs font-semibold opacity-90">Paid Transactions</p>
          <p className="mt-1 text-2xl font-black">{stats.paid}</p>
        </div>
      </div>

      {/* 3. DYNAMIC FILTERS TOOLBAR */}
      <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
              placeholder="Search student name or course..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs outline-none focus:border-rose-500 focus:bg-white"
            />
          </div>

          {/* Status Select Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setActiveTab(e.target.value || "All");
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-rose-500"
          >
            <option value="">All Enrollment Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Payment Status Select Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-rose-500"
          >
            <option value="">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {(search || statusFilter || paymentFilter || activeTab !== "All") && (
          <button
            onClick={handleReset}
            className="text-xs font-bold text-rose-500 hover:underline"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* 4. TAB PILLS & VIEW TOGGLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Enrollments</h3>
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
            { label: "All" },
            { label: "Pending" },
            { label: "Active" },
            { label: "Completed" },
            { label: "Cancelled" },
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

      {/* 5. ENROLLMENTS DISPLAY */}
      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center rounded-2xl bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-xs">
          <AlertCircle className="mx-auto mb-2 text-rose-500" size={32} />
          <p className="text-sm font-semibold text-rose-600">
            Failed to load enrollments
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {error?.response?.data?.message || "Something went wrong"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-xs font-bold text-white"
          >
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 py-16 text-center text-slate-400">
          <GraduationCap size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold text-slate-600">
            No enrollments found matching criteria.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Student registration records will appear here.
          </p>
        </div>
      ) : viewMode === "list" ? (
        /* TABLE / LIST VIEW */
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5 border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {enrollments.map((enrollment, idx) => (
                    <motion.tr
                      key={enrollment._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: idx * 0.02 }}
                      className="group transition-colors hover:bg-slate-50/80"
                    >
                      {/* STUDENT */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 font-bold text-indigo-600 shadow-xs">
                            <GraduationCap size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                              {enrollment.student?.fullName || "Unknown"}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {enrollment.student?.email || ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* COURSE */}
                      <td className="px-6 py-4">
                        <p className="max-w-55 truncate font-semibold text-slate-900">
                          {enrollment.course?.title || "Unknown course"}
                        </p>
                        <p className="font-mono text-[11px] text-slate-400">
                          Rs.{" "}
                          {Number(
                            enrollment.course?.fee ?? 0,
                          ).toLocaleString()}
                        </p>
                      </td>

                      {/* STATUS SELECTOR */}
                      <td className="px-6 py-4">
                        <select
                          value={enrollment.status}
                          disabled={statusMutation.isPending}
                          onChange={(e) =>
                            statusMutation.mutate({
                              id: enrollment._id,
                              status: e.target.value,
                            })
                          }
                          className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-rose-500 focus:bg-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* PAYMENT */}
                      <td className="px-6 py-4">
                        <PaymentStatusBadge
                          status={enrollment.paymentStatus}
                        />
                      </td>

                      {/* PROGRESS */}
                      <td className="px-6 py-4">
                        <div className="w-28">
                          <div className="mb-1.5 flex justify-between font-semibold">
                            <span className="text-slate-500">Progress</span>
                            <span className="text-slate-900">
                              {enrollment.progress || 0}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full border border-slate-200/60 bg-slate-100">
                            <div
                              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                              style={{
                                width: `${enrollment.progress || 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            title="Approve Enrollment"
                            disabled={statusMutation.isPending}
                            onClick={() => handleApprove(enrollment)}
                            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-30"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            type="button"
                            title="Cancel Enrollment"
                            disabled={cancelMutation.isPending}
                            onClick={() => handleCancel(enrollment)}
                            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"
                          >
                            <Ban size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {enrollments.map((enrollment, idx) => (
              <motion.div
                key={enrollment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-md"
              >
                <div className="space-y-3">
                  {/* Top Row: Student info & Payment badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 font-bold text-indigo-600 shadow-xs">
                        <GraduationCap size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-rose-500 transition-colors">
                          {enrollment.student?.fullName || "Unknown Student"}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {enrollment.student?.email || ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="rounded-xl bg-slate-50/70 p-3">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">
                      {enrollment.course?.title || "Unknown Course"}
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                      Fee: Rs.{" "}
                      {Number(enrollment.course?.fee ?? 0).toLocaleString()}
                    </p>
                  </div>

                  {/* Status & Payment Row */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-400">
                        Status:
                      </span>
                      <select
                        value={enrollment.status}
                        disabled={statusMutation.isPending}
                        onChange={(e) =>
                          statusMutation.mutate({
                            id: enrollment._id,
                            status: e.target.value,
                          })
                        }
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 outline-none focus:border-rose-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <PaymentStatusBadge status={enrollment.paymentStatus} />
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-slate-700">
                        {enrollment.progress || 0}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${enrollment.progress || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Grid Footer Actions */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold">
                  <button
                    onClick={() => handleCancel(enrollment)}
                    disabled={cancelMutation.isPending}
                    className="flex items-center gap-1 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Ban size={14} /> Cancel
                  </button>
                  <button
                    onClick={() => handleApprove(enrollment)}
                    disabled={statusMutation.isPending}
                    className="flex items-center gap-1 text-emerald-600 hover:underline"
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 6. PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-slate-400">
            Page <strong className="text-slate-700">{page}</strong> of{" "}
            <strong className="text-slate-700">{totalPages}</strong> (
            {totalEnrollments} records)
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
        loading={statusMutation.isPending || cancelMutation.isPending}
        onConfirm={confirmAction?.onConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
};

export default EnrollmentManagement;