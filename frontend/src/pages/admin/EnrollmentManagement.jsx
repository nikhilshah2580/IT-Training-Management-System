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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  // GET ENROLLMENTS
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-enrollments"],
    queryFn: () =>
      getEnrollments({
        page: 1,
        limit: 10,
      }),
  });

  const enrollments = data?.enrollments || [];

  // UPDATE ENROLLMENT STATUS
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateEnrollmentStatus(id, status),
    onSuccess: (data) => {
      toast.success(data?.message || "Enrollment status updated");
      queryClient.invalidateQueries({
        queryKey: ["admin-enrollments"],
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update enrollment",
      );
    },
  });

  // CANCEL ENROLLMENT
  const cancelMutation = useMutation({
    mutationFn: cancelEnrollment,
    onSuccess: (data) => {
      toast.success(data?.message || "Enrollment cancelled");
      queryClient.invalidateQueries({
        queryKey: ["admin-enrollments"],
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to cancel enrollment",
      );
    },
  });

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center bg-gray-50 rounded-2xl">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">
            Loading student enrollments...
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
          Failed to load enrollments
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {error?.response?.data?.message || "Something went wrong"}
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
            Enrollment Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor student course enrollments, track academic progress, and
            manage payment records.
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-50 transition"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh Records
        </motion.button>
      </div>

      {/* MODERN STYLED TABLE CONTAINER */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/75 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 text-sm">
              {enrollments.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center text-gray-400"
                  >
                    <GraduationCap
                      size={40}
                      className="mx-auto mb-3 opacity-30 text-gray-600"
                    />
                    <p className="font-semibold text-gray-600">
                      No enrollments found.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Student registration records will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {enrollments.map((enrollment, idx) => (
                    <motion.tr
                      key={enrollment._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: idx * 0.02 }}
                      className="group hover:bg-gray-50/80 transition-colors"
                    >
                      {/* STUDENT */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold border border-indigo-100 shadow-xs">
                            <GraduationCap size={18} />
                          </div>

                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {enrollment.student?.fullName || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {enrollment.student?.email || ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* COURSE */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 max-w-55 truncate">
                          {enrollment.course?.title || "Unknown course"}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          Rs.{" "}
                          {Number(enrollment.course?.fee ?? 0).toLocaleString()}
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
                          className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-semibold text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
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
                        <PaymentStatusBadge status={enrollment.paymentStatus} />
                      </td>

                      {/* PROGRESS */}
                      <td className="px-6 py-4">
                        <div className="w-28">
                          <div className="mb-1.5 flex justify-between text-xs font-semibold">
                            <span className="text-gray-500">Progress</span>
                            <span className="text-gray-900">
                              {enrollment.progress || 0}%
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-gray-100 border border-gray-200/60">
                            <div
                              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
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
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            title="Approve Enrollment"
                            disabled={statusMutation.isPending}
                            onClick={() =>
                              statusMutation.mutate({
                                id: enrollment._id,
                                status: "Approved",
                              })
                            }
                            className="rounded-xl p-2.5 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-30 transition-colors"
                          >
                            <CheckCircle size={17} />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            title="Cancel Enrollment"
                            disabled={cancelMutation.isPending}
                            onClick={() =>
                              cancelMutation.mutate(enrollment._id)
                            }
                            className="rounded-xl p-2.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 transition-colors"
                          >
                            <Ban size={17} />
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
            Total active entries:{" "}
            <strong className="text-gray-900">{enrollments.length}</strong>
          </span>
          <span className="text-gray-400 font-normal">
            Real-time synchronized
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default EnrollmentManagement;
