import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getEnrollments,
  updateEnrollmentStatus,
  updateEnrollmentPaymentStatus,
  cancelEnrollment,
} from "../../api/enrollment.services";

import { toast } from "react-toastify";

import {
  CheckCircle,
  XCircle,
  Ban,
  Loader2,
  CreditCard,
  GraduationCap,
} from "lucide-react";

const EnrollmentManagement = () => {
  const queryClient = useQueryClient();

  // GET ENROLLMENTS

  const { data, isLoading, isError, error } = useQuery({
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

  // UPDATE PAYMENT STATUS

  const paymentMutation = useMutation({
    mutationFn: ({ id, paymentStatus }) =>
      updateEnrollmentPaymentStatus(id, paymentStatus),

    onSuccess: (data) => {
      toast.success(data?.message || "Payment status updated");

      queryClient.invalidateQueries({
        queryKey: ["admin-enrollments"],
      });
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update payment");
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

  // LOADING

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  // ERROR

  if (isError) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-600">
          {error?.response?.data?.message || "Failed to load enrollments"}
        </p>
      </div>
    );
  }

  // RENDER

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Enrollment Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage student course enrollments and payments.
        </p>
      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-275">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Student
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Course
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Payment
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Progress
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {enrollments.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No enrollments found.
                  </td>
                </tr>
              ) : (
                enrollments.map((enrollment) => (
                  <tr key={enrollment._id} className="hover:bg-gray-50">
                    {/* STUDENT */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <GraduationCap size={18} className="text-blue-600" />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {enrollment.student?.fullName || "Unknown"}
                          </p>

                          <p className="text-sm text-gray-500">
                            {enrollment.student?.email || ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* COURSE */}

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {enrollment.course?.title || "Unknown course"}
                      </p>

                      <p className="text-sm text-gray-500">
                        Rs. {enrollment.course?.fee ?? 0}
                      </p>
                    </td>

                    {/* STATUS */}

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
                        className="rounded-lg border px-3 py-2 text-sm"
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
                      <select
                        value={enrollment.paymentStatus}
                        disabled={paymentMutation.isPending}
                        onChange={(e) =>
                          paymentMutation.mutate({
                            id: enrollment._id,
                            paymentStatus: e.target.value,
                          })
                        }
                        className="rounded-lg border px-3 py-2 text-sm"
                      >
                        <option value="Pending">Pending</option>

                        <option value="Paid">Paid</option>

                        <option value="Failed">Failed</option>
                      </select>
                    </td>

                    {/* PROGRESS */}

                    <td className="px-6 py-4">
                      <div className="w-28">
                        <div className="mb-1 flex justify-between text-xs">
                          <span>Progress</span>

                          <span>{enrollment.progress}%</span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-blue-600"
                            style={{
                              width: `${enrollment.progress || 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="Approve"
                          disabled={statusMutation.isPending}
                          onClick={() =>
                            statusMutation.mutate({
                              id: enrollment._id,
                              status: "Approved",
                            })
                          }
                          className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                        >
                          <CheckCircle size={18} />
                        </button>

                        <button
                          type="button"
                          title="Cancel"
                          disabled={cancelMutation.isPending}
                          onClick={() => cancelMutation.mutate(enrollment._id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        >
                          <Ban size={18} />
                        </button>

                        <button
                          type="button"
                          title="Mark payment paid"
                          disabled={paymentMutation.isPending}
                          onClick={() =>
                            paymentMutation.mutate({
                              id: enrollment._id,
                              paymentStatus: "Paid",
                            })
                          }
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <CreditCard size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentManagement;
